# AGENTS.md

Guidance for AI coding agents working in this repository. The format follows the
[agents.md](https://agents.md/) spec so it is consumed by OpenCode, Codex,
Cursor, Aider, Devin, Gemini CLI, and similar tools.

## Project

Buku Lagu Katolik (Buku Pozo) is a Catholic hymnbook mobile app for parishes
and individuals. Bilingual UI (Malay / English), offline-first, with a built
song library plus a personal "Lagu Saya" (My Songs) collection that the user
can add to locally.

## Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19.1, Hermes, new
  architecture enabled
- **Routing**: `expo-router` v6 (file-based, route group `(tabs)` for bottom
  tabs, dynamic routes `song/[id]/index`, `song/category/[id]`,
  `edit-song/[id]`)
- **Language**: TypeScript 5.9 (strict). Config extends
  `@tsconfig/react-native`. Path alias `@/*` → repo root.
- **State**: React Context only — `ThemeContext`, `LanguageContext`,
  `FavoritesContext`, `MySongsContext`, `MassContext`. No Redux, no Zustand.
- **Persistence**: `@react-native-async-storage/async-storage`. Keyed by
  `theme_mode`, `color_theme`, `my_songs`, `ignored_version`, etc.
- **Icons**: `lucide-react-native` (do not add another icon library).
- **Animations**: `react-native-reanimated` v4 + `react-native-worklets`.
- **Updates**: `expo-updates` for OTA; store version check via
  `version.json` on the `master` branch raw URL.
- **Build / ship**: EAS Build (`eas.json`, project id
  `e7ba5e9f-7429-4986-8ab7-a42245d0d561`, slug `lagu_pozoo`,
  bundle id `com.tytusdl.lagu_pozoo` / `com.tytusdl.lagu-pozoo`).

## Commands

Run from the project root (Windows / PowerShell):

- `npm install` — install dependencies.
- `npm run dev` — start Expo dev server with cleared cache.
- `npm run dev:fix` — write local IP into `./.expo/ip.txt` then start on
  port 8082 (use this on Windows when the QR code points at the wrong IP).
- `npm run web` — start the web build via Metro.
- `npm run build:web` — `expo export --platform web` to `dist/`.
- `npm run lint` — `expo lint` (installs ESLint on first run).
- `npm run optimize:all` — convert `assets/images/splash.png` to WebP via
  `sharp-cli`. Run manually; not part of the normal dev loop.
- `npx tsc --noEmit` — type-check without emitting.

> The user-level `.npmrc` sets `legacy-peer-deps=true`. `npx expo install`
> sometimes trips on it; if a postinstall fails with `EALLOWSCRIPTS`,
> fall back to plain `npm install --save` / `--save-dev`. The project's
> `node_modules` builds fine that way.

## Layout

```
app/                        expo-router routes
  _layout.tsx               root: providers + animated splash + update check
  (tabs)/                   bottom-tab screens
    _layout.tsx             Tabs with custom safe-area, freezeOnBlur
    index.tsx               Lagu (song list / categories)
    favorites.tsx
    misa.tsx                mass liturgy planner
    setting.tsx
  song/[id]/index.tsx       song detail (lyrics + share)
  song/category/[id].tsx    category listing
  edit-song/[id].tsx
  my-songs.tsx              user-added songs list
  add-song.tsx
  components/               shared UI: SongLyrics, UpdateModal, ChangelogModal
  context/                  Context providers (see Stack above)
  data/
    songs/
      songs.ts              main song DB (Song[] inlined, full lyrics)
      songsR.ts             extended/secondary song DB
      songIndex.ts          lightweight id+title+number index (no lyrics)
      index.ts              re-exports
    changelog.ts            in-app changelog history
    contributors.ts
  utils/imageCache.ts       banner image cache
assets/images/              icons, splash, category banners (WebP)
components/                 AnimatedSplash.tsx (root splash animation)
src/translations.ts         i18n strings keyed by 'Melayu' | 'English'
```

## CRITICAL: Scope discipline (READ FIRST before any change)

**Do exactly what the user asked. Nothing more, nothing less.**

- **If the user describes a SYMPTOM** ("title overlaps status bar", "X is broken",
  "this looks wrong"), fix THAT symptom with the **minimal change**. Don't
  restructure surrounding layout, don't move other UI elements, don't add
  new sections, don't reorganize existing components the user already approved.
- **If the user describes a CHANGE they want** ("move X to here", "add button
  with label Y"), do EXACTLY that — don't infer additional changes from
  surrounding context.
- **Before making ANY change beyond the literal request, ask first.** Use a
  short ask_user popup or a single-sentence inline question. Do not silently
  expand scope because you think it would "look better" or "be more
  consistent".
- **This applies to: layout, copy, colors, navigation, file structure,
  dependencies, refactors. All of it.**
- **Repeated violation pattern from past sessions:** user asks to remove
  something → agent also moves other elements around without asking →
  user gets angry. Avoid this. If unsure, ASK, don't act.

Examples of CORRECT minimal-fix scope:
- User: "X bertindih dengan status bar" → Fix: add invisible spacer with
  `height: insets.top` at top of content. NOT: create a dedicated top bar
  that moves the title and X button.
- User: "Buang ayat pratonton" → Fix: delete that one piece of UI. NOT:
  also restructure the whole toolbar / move other buttons.
- User: "Ubah kod lagu supaya ada label KOD" → Fix: prefix the existing
  text with "KOD: ". NOT: redesign the song row or restyle adjacent
  components.

**Always re-read this section before touching a file when the user reports
a bug or asks for a specific change.** It is the single most-violated rule
in this repo.

## Conventions

- **Language model is bilingual**: every user-facing string must exist in
  both `Melayu` and `English`. Use the `t(key)` helper from
  `LanguageContext`; do not inline hardcoded strings in JSX.
- **Song IDs**: stable, source-of-truth is `songIndex.ts`. New songs
  append, never renumber existing IDs. Song number letter (A/B/C…)
  lives in `songNumber`; the prefix letter of `id` must match.
- **Theme**: read colors via `useTheme().currentColorTheme`, never hardcode
  hex outside `ThemeContext.tsx`. Dark mode is the inverted base palette,
  not a separate theme.
- **Persistence**: one AsyncStorage key per feature, namespaced in the
  context that owns it (see `MY_SONGS_STORAGE_KEY`,
  `THEME_STORAGE_KEY`, `COLOR_THEME_STORAGE_KEY`).
- **Safe areas (iOS notch + Android gesture bar)**: every Modal or
  full-screen surface MUST account for top + bottom safe-area insets. Wrap
  in `SafeAreaView` from `react-native-safe-area-context` with
  `edges={['top','left','right','bottom']}` for full-screen modals, or use
  `useSafeAreaInsets()` to apply padding to top/bottom bars individually.
  Don't trust `presentationStyle="fullScreen"` to auto-handle the notch —
  it doesn't. See gotcha entries below for specific patterns.
- **Routing**: typed routes are enabled (`experiments.typedRoutes` in
  `app.json`). Use `router.navigate` / `router.replace` from
  `expo-router`, not `Link` to literal paths when a typed route exists.
- **Deep links**: custom scheme `lagu-pozoo://`. Save-song flow is
  `lagu-pozoo://savesong?data=<urlencoded-json>`. `RootLayout` already
  parses these — extend `processDeepLink` rather than re-handling in
  screens.
- **i18n file**: `src/translations.ts`. New keys go at the end of each
  language block, never in the middle, to keep diffs small.

## Gotchas

- **`expo-patch.js` is Windows-specific.** It writes the local IPv4 into
  `./.expo/ip.txt` so the QR code resolves. Safe to delete on macOS/Linux.
- **Bottom-sheet Modals MUST respect `useSafeAreaInsets().bottom` on Android**.
  Slide-up modals (`Modal animationType="slide"`, `justifyContent: 'flex-end'`,
  `statusBarTranslucent`) extend all the way to the screen edge and will
  overlap the Android system nav bar (3-button or gesture pill). Symptom:
  the modal's footer button / last card gets hidden behind nav buttons, or
  user can't tap the close button without hitting nav. Fix: in the modal
  container style, set
  `paddingBottom: Math.max(insets.bottom, 20) + 8`
  where `insets = useSafeAreaInsets()`. iOS-only `paddingBottom: 20` is
  not enough on Android — the bottom nav bar is taller. Required on any
  new bottom-sheet style modal (e.g. `LyricsReportsListModal`,
  `ShareBottomSheet`, `ContactModal`, `ReportLyricsModal`).
- **Modal close button convention: X top-right, NOT bottom "Tutup" pill.**
  All new modals MUST use a circular X button positioned absolute top-right
  (32x32, `rgba(0,0,0,0.06)` background, `X` icon from `lucide-react-native`
  at 20pt, `strokeWidth: 2.4`, `hitSlop: {top:12, bottom:12, left:12, right:12}`).
  Wrap modal body in a `ScrollView` with `contentContainerStyle: { paddingTop: 36 }`
  so content doesn't sit under the X. Do NOT add a bottom "Tutup" / "Close"
  pill button — it eats vertical space and forces a fixed maxHeight. Tap
  outside the modal or the X are the only dismiss affordances. Reference
  style: `supporterCloseX` in `app/(tabs)/setting.tsx`.
- **Full-screen modals on iPhone MUST absorb `useSafeAreaInsets().top` — never
  let content touch the status bar / Dynamic Island.** Symptom: title or
  big text overlaps the iOS clock, signal, battery icons at the top of the
  screen. Fix pattern: render an **invisible spacer** at the very top of
  the Modal content (before any other UI): `<View style={{ height: insets.top }} />`.
  This pushes the existing layout down by the safe-area inset without
  restructuring anything. DO NOT move the title or close button into a
  separate top bar — that changes the layout the user already approved.
  `presentationStyle="fullScreen"` does NOT auto-reserve the notch area;
  you have to handle the inset yourself. Reference: preview modal in
  `app/(tabs)/misa.tsx` (share-image preview).
- **Splash race**: `SplashScreen.preventAutoHideAsync()` is set, then
  fonts + main banner preload in `RootLayout.prepare()`. Hide only after
  `AnimatedSplash.onAnimationFinish` fires — see `app/_layout.tsx`.
- **Splash → App transition MUST stay as overlay, not swap**: `_layout.tsx`
  keeps the full Provider tree mounted from the start; `<AnimatedSplash/>`
  is rendered as an *overlay sibling* (use `absoluteFillObject`) inside the
  same Providers and gated by `{!splashAnimationFinished && ...}`. Do NOT
  `return <AnimatedSplash/>` while splash is up and `return <SafeAreaProvider>`
  after — that swap causes an iOS stutter because all six Contexts hydrate
  + Stack mounts on the same frame the user first sees content.
- **First-paint logo must use `Animated.View` wrapping plain `<Image>`**:
  never `Animated.Image` for the splash logo. `Animated.Image` drops frames
  on iOS first paint because Reanimated's worklet attaches at the same time
  the native side is decoding the asset. Also avoid `withSequence(...)` for
  the logo's intro — replace with `withSpring(1, {damping:18, stiffness:180, mass:0.8})`
  for cross-platform parity. Pre-download the icon via
  `Asset.fromModule(require('./assets/images/icon.png')).downloadAsync()` in
  `prepare()` so the asset is in cache before splash mounts.
- **Bilingual alerts**: `Alert.alert` copy in `_layout.tsx` already
  branches on `currentLanguage`. Re-use that pattern instead of writing
  English-only `Alert`s in new code.
- **Update modal**: store check (raw `version.json`) runs first, then OTA
  via `expo-updates`. Set `DEBUG_FORCE_SHOW_UPDATE` to preview locally.
- **`version.json` fetch silently fails if the repo is private.** The
  store-version check in `_layout.tsx` fetches
  `https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json`
  on every app launch. If the repo is private (or the branch is renamed),
  GitHub returns 404, the code logs `[UpdateCheck] Store version check
  skipped or failed` and falls through. **Users on older versions never
  see the update modal** until the repo is public again — Play Store's
  own update nag is gradual and misses many users. Always verify the URL
  is reachable (HTTP 200) after any repo visibility / branch rename,
  otherwise the in-app update prompt silently dies.
- **.bak files**: `*.bak.tsx` are excluded from `tsconfig`; leave them
  alone unless you are actively restoring from one.
- **Song DB size**: `songs.ts` is ~6.5k lines because lyrics are inlined.
  Don't import it for list views — use `songIndex.ts` (no lyrics) for
  category/search lists, and only pull the full `Song` in the detail
  screen. This is the 88% category-load speedup from 1.8.0.
- **Type-safe routes**: `experiments.typedRoutes` is on. If a screen path
  doesn't exist, the type checker will fail before Metro does.

## Release flow (when bumping version)

> **HARD RULE: `version.json` MUST be committed and pushed to `master`
> on the public GitHub repo (`tytusdl/BUKU-LAGU-KATOLIK`) as part of
> every release. Without this push, the in-app update prompt silently
> dies — `raw.githubusercontent.com` returns 404 for a private repo
> and the fetch in `app/_layout.tsx` falls through. Never skip this
> step, even for "small" releases. After pushing, verify with:
>
> ```
> curl -sI https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json
> ```
>
> Expect `HTTP/2 200`. A `404` means the prompt won't work for users on
> older versions — fix the repo visibility before announcing the
> release.

1. Bump `version` in `package.json` and `app.json` (and `ios.buildNumber`).
2. Edit `app/data/changelog.ts` — add a new entry at the top of
   `changelogData` with bilingual `text` per change.
3. Edit the root `version.json` (used by the store-version check):
   bump `version`, add `releaseNotes` in both languages, decide
   `forceUpdate` and `minVersion`.
4. Run `npx tsc --noEmit` and `npm run lint`; both must pass.
5. **Commit AND push `version.json` to `master` on the public repo.**
   This is what the in-app updater reads on launch — a missed push
   means every user still on the previous build will never see the
   update prompt. After pushing, sanity-check
   `https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json`
   returns the new version (not 404, not the old version).
6. Commit on a branch, push, then `eas build --profile preview` (or
   `production` for store).

## Build flow (EAS Build)

All release artifacts are produced via **Expo Application Services (EAS)**
in the cloud. No Xcode or Android Studio install needed locally — only
the EAS CLI plus an Expo account.

### Required tooling / Tooling diperlukan
- `npm install -g eas-cli` — submit / build / credential commands.
- `eas login` — link to the Expo account that owns the project
  (`e7ba5e9f-7429-4986-8ab7-a42245d0d561` in `app.json`).
- Existing `eas.json` defines three profiles:
  - `development` — dev client (debug-enabled), internal distribution.
  - `preview` — Android `.apk`, iOS `.ipa` (ad-hoc), internal testing.
  - `production` — Android `.aab`, iOS `.ipa` (release), store-bound;
    `autoIncrement: true` so versionCode / buildNumber bumps
    automatically from the EAS server.

### Android

```bash
# Preview — APK for sideloading / internal testers
eas build --platform android --profile preview

# Production — AAB for Google Play
eas build --platform android --profile production

# Submit to Play Store (after build finishes)
eas submit --platform android --latest
```

`eas submit --platform android` requires a **service-account JSON** from
Google Play Console configured in EAS dashboard
(`https://expo.dev/accounts/[account]/projects/lagu_pozoo/settings/submissions`).
Without this, the submit command fails — agent should surface this to
the user before assuming `eas submit` "just works". See
https://docs.expo.dev/submit/android/.

### iOS

```bash
# Preview — IPA for internal testing (TestFlight or ad-hoc)
eas build --platform ios --profile preview

# Production — IPA for App Store
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --latest
```

`ascAppId` is hard-coded in `eas.json:submit.production.ios` to
`6759234151`. First-time iOS setup needs `eas credentials:configure
--platform ios` — prefer the **EAS-managed credentials** option (EAS
generates + holds the distribution certificate and provisioning
profile, free of charge). Manual cert upload is supported but is a
maintenance burden for a solo dev — agent should default to managed.

### Gotchas

- **First EAS build is slow** (~10-20 min, downloads + caches every
  native dep on the EAS worker). Subsequent builds reuse the cache and
  finish in 2-5 min. Don't trigger `--clear-cache` unless the user
  reports a Gradle / pod install mismatch.
- **Don't run `eas build` and `expo run:android` / `expo run:ios`
  back-to-back.** Local builds modify `android/` and `ios/` folders in
  place and may collide with the next EAS build's native cache. Use
  one or the other per session.
- **`autoIncrement` only updates `versionCode` / `buildNumber` on the
  EAS server.** It does NOT modify `app.json` locally. Don't manually
  bump `versionCode` in `app.json` for production builds — EAS will
  overwrite anyway and the manual bump will be lost next commit.
- **`appVersionSource: "remote"`** is set in `eas.json` for the same
  reason: iOS build numbers must come from the EAS server, not from
  `app.json`. Treat `app.json:ios.buildNumber` as a hint, not a hard
  truth — the canonical build number for store submission is whatever
  EAS produced last.
- **Internal distribution for iOS** needs at least one device UDID
  registered on the Apple Developer account before the `.ipa` can be
  installed. EAS handles auto-registration IF configured — otherwise
  the user has to manually register UDIDs through App Store Connect
  for each tester device.
- **`eas build:list`** lists every build with status, profile, and a
  download URL for the artifact. Use this to verify a build finished
  successfully and grab the URL — never trust the in-progress spinner
  alone.

## When in doubt

- **Re-read the "CRITICAL: Scope discipline" section above before
  acting.** The single most common mistake in this repo is expanding scope
  beyond what the user asked. When unsure whether to do X, ask via
  `ask_user` instead of acting.
- Look at the neighboring file for the pattern before adding a new one.
- Reuse the existing Contexts; do not introduce a new global store.
- Bilingual copy is non-negotiable.
- For behavior the user just saw, ask for the screenshot / log line
  rather than guessing.
