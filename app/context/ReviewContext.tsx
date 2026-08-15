import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { AppState, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

// AsyncStorage keys — namespaced by feature, matching repo convention.
const REVIEW_OPEN_COUNT_KEY = 'review_songs_opened_count';
const REVIEW_LAST_PROMPTED_KEY = 'review_last_prompted_at';
const REVIEW_DISMISS_COUNT_KEY = 'review_dismiss_count';
const REVIEW_HAS_PROMPTED_KEY = 'review_has_prompted';

// Trigger rules — tuned to be polite and not spammy.
// Apple itself caps in-app `requestReview` to ~3 prompts per year per app,
// so we keep our own gate conservative on top of that.
const OPEN_COUNT_THRESHOLD = 10;       // ask after this many song-detail opens
const COOLDOWN_DAYS = 60;              // wait this long between prompts
const DISMISS_LIMIT = 2;                // never prompt again after N dismissals

type ReviewContextValue = {
  /** Increment when a song-detail screen successfully mounts. */
  trackSongOpened: () => Promise<void>;
  /** True if the OS supports StoreReview on this device. */
  isAvailable: boolean;
  /** Manually request a review (for the Settings "Rate this app" button). */
  requestReview: () => Promise<boolean>;
  /** Open the store page directly — fallback when in-app review isn't available. */
  openStorePage: () => Promise<void>;
  /** State mirror for debugging / Settings preview. */
  state: ReviewState;
};

type ReviewState = {
  openCount: number;
  dismissCount: number;
  hasPrompted: boolean;
  lastPromptedAt: number | null;
};

const DEFAULT_STATE: ReviewState = {
  openCount: 0,
  dismissCount: 0,
  hasPrompted: false,
  lastPromptedAt: null,
};

const ReviewContext = createContext<ReviewContextValue>({
  trackSongOpened: async () => {},
  isAvailable: false,
  requestReview: async () => false,
  openStorePage: async () => {},
  state: DEFAULT_STATE,
});

export const useReview = () => useContext(ReviewContext);

type ReviewProviderProps = {
  children: ReactNode;
};

export const ReviewProvider = ({ children }: ReviewProviderProps) => {
  const [state, setState] = useState<ReviewState>(DEFAULT_STATE);
  const [isAvailable, setIsAvailable] = useState(false);
  const hasHydrated = useRef(false);

  // Hydrate persisted state + probe StoreReview availability once.
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const [openRaw, dismissRaw, hasPromptedRaw, lastRaw] = await Promise.all([
          AsyncStorage.getItem(REVIEW_OPEN_COUNT_KEY),
          AsyncStorage.getItem(REVIEW_DISMISS_COUNT_KEY),
          AsyncStorage.getItem(REVIEW_HAS_PROMPTED_KEY),
          AsyncStorage.getItem(REVIEW_LAST_PROMPTED_KEY),
        ]);

        const available = await StoreReview.isAvailableAsync().catch(() => false);

        if (cancelled) return;
        setState({
          openCount: openRaw ? parseInt(openRaw, 10) || 0 : 0,
          dismissCount: dismissRaw ? parseInt(dismissRaw, 10) || 0 : 0,
          hasPrompted: hasPromptedRaw === '1',
          lastPromptedAt: lastRaw ? parseInt(lastRaw, 10) || null : null,
        });
        setIsAvailable(available);
      } catch (err) {
        // Non-fatal — default state remains.
        console.warn('[Review] hydrate failed:', err);
      } finally {
        if (!cancelled) hasHydrated.current = true;
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  // Helper: decide if we should ask for a review right now.
  const shouldPrompt = useCallback(
    (s: ReviewState): boolean => {
      if (s.hasPrompted) return false;
      if (s.dismissCount >= DISMISS_LIMIT) return false;
      if (s.openCount < OPEN_COUNT_THRESHOLD) return false;
      if (s.lastPromptedAt) {
        const elapsedDays =
          (Date.now() - s.lastPromptedAt) / (1000 * 60 * 60 * 24);
        if (elapsedDays < COOLDOWN_DAYS) return false;
      }
      return true;
    },
    []
  );

  // Persist state to AsyncStorage whenever it changes (after hydration).
  useEffect(() => {
    if (!hasHydrated.current) return;
    const persist = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(REVIEW_OPEN_COUNT_KEY, String(state.openCount)),
          AsyncStorage.setItem(
            REVIEW_DISMISS_COUNT_KEY,
            String(state.dismissCount)
          ),
          AsyncStorage.setItem(
            REVIEW_HAS_PROMPTED_KEY,
            state.hasPrompted ? '1' : '0'
          ),
          state.lastPromptedAt
            ? AsyncStorage.setItem(
                REVIEW_LAST_PROMPTED_KEY,
                String(state.lastPromptedAt)
              )
            : AsyncStorage.removeItem(REVIEW_LAST_PROMPTED_KEY),
        ]);
      } catch (err) {
        console.warn('[Review] persist failed:', err);
      }
    };
    persist();
  }, [state]);

  // Increment open count + try to prompt when thresholds cross.
  const trackSongOpened = useCallback(async () => {
    setState(prev => {
      const nextOpenCount = prev.openCount + 1;
      const next: ReviewState = { ...prev, openCount: nextOpenCount };

      // Defer the actual prompt — by the time we leave this setState callback,
      // the navigator might already be on the next screen and `requestReview`
      // needs to be invoked outside React's reducer (it triggers a native
      // dialog).
      if (shouldPrompt(next) && hasHydrated.current) {
        // Fire-and-forget; internal try/catch will log any failure.
        void firePrompt(next, setState);
      }
      return next;
    });
  }, [shouldPrompt]);

  const requestReview = useCallback(async (): Promise<boolean> => {
    try {
      if (!(await StoreReview.isAvailableAsync())) {
        return false;
      }
      await StoreReview.requestReview();
      setState(prev => ({
        ...prev,
        hasPrompted: true,
        lastPromptedAt: Date.now(),
      }));
      return true;
    } catch (err) {
      console.warn('[Review] requestReview failed:', err);
      return false;
    }
  }, []);

  // Fallback: deep-link the user to the public store listing / write-review page.
  const openStorePage = useCallback(async () => {
    try {
      // iOS uses the App Store review action URL; Android uses the package id.
      // StoreReview.storeUrl() picks the right one for the current platform.
      let url = await StoreReview.storeUrl();
      // Manifest-based URL can be empty in some dev builds — fall back to the
      // known store listings so the button still does something.
      if (!url) {
        url =
          Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/buku-lagu-katolik/id6479187123'
            : 'https://play.google.com/store/apps/details?id=com.tytusdl.lagu_pozoo';
      }
      if (url) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('[Review] openStorePage failed:', err);
    }
  }, []);

  const value = useMemo<ReviewContextValue>(
    () => ({
      trackSongOpened,
      isAvailable,
      requestReview,
      openStorePage,
      state,
    }),
    [trackSongOpened, isAvailable, requestReview, openStorePage, state]
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

// Internal: trigger the native review dialog and record outcome.
// We can't observe whether the user actually rated vs dismissed — both paths
// flip `hasPrompted = true` because Apple's API gives no callback. This is the
// standard pattern for `expo-store-review`.
async function firePrompt(
  current: ReviewState,
  setState: React.Dispatch<React.SetStateAction<ReviewState>>
) {
  try {
    if (!(await StoreReview.isAvailableAsync())) return;
    await StoreReview.requestReview();
    setState({
      ...current,
      hasPrompted: true,
      lastPromptedAt: Date.now(),
    });
  } catch (err) {
    console.warn('[Review] auto-prompt failed:', err);
  }
}

// Optional helper exported for Settings screen — lets the user explicitly
// "I already rated" or "Don't ask again" without going through the prompt flow.
export async function markDismissed() {
  try {
    const raw = await AsyncStorage.getItem(REVIEW_DISMISS_COUNT_KEY);
    const next = (parseInt(raw || '0', 10) || 0) + 1;
    await AsyncStorage.setItem(REVIEW_DISMISS_COUNT_KEY, String(next));
  } catch (err) {
    console.warn('[Review] markDismissed failed:', err);
  }
}

export default ReviewProvider;

// Platform sanity check used in dev to confirm we wired it right.
export const __platform = Platform.OS;
export const __debugAppState = AppState;