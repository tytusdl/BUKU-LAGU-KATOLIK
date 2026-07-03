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
- **Splash race**: `SplashScreen.preventAutoHideAsync()` is set, then
  fonts + main banner preload in `RootLayout.prepare()`. Hide only after
  `AnimatedSplash.onAnimationFinish` fires — see `app/_layout.tsx`.
- **Bilingual alerts**: `Alert.alert` copy in `_layout.tsx` already
  branches on `currentLanguage`. Re-use that pattern instead of writing
  English-only `Alert`s in new code.
- **Update modal**: store check (raw `version.json`) runs first, then OTA
  via `expo-updates`. Set `DEBUG_FORCE_SHOW_UPDATE` to preview locally.
- **.bak files**: `*.bak.tsx` are excluded from `tsconfig`; leave them
  alone unless you are actively restoring from one.
- **Song DB size**: `songs.ts` is ~6.5k lines because lyrics are inlined.
  Don't import it for list views — use `songIndex.ts` (no lyrics) for
  category/search lists, and only pull the full `Song` in the detail
  screen. This is the 88% category-load speedup from 1.8.0.
- **Type-safe routes**: `experiments.typedRoutes` is on. If a screen path
  doesn't exist, the type checker will fail before Metro does.

## Release flow (when bumping version)

1. Bump `version` in `package.json` and `app.json` (and `ios.buildNumber`).
2. Edit `app/data/changelog.ts` — add a new entry at the top of
   `changelogData` with bilingual `text` per change.
3. Edit the root `version.json` (used by the store-version check):
   bump `version`, add `releaseNotes` in both languages, decide
   `forceUpdate` and `minVersion`.
4. Run `npx tsc --noEmit` and `npm run lint`; both must pass.
5. Commit on a branch, push, then `eas build --profile preview` (or
   `production` for store).

## When in doubt

- Look at the neighboring file for the pattern before adding a new one.
- Reuse the existing Contexts; do not introduce a new global store.
- Bilingual copy is non-negotiable.
- For behavior the user just saw, ask for the screenshot / log line
  rather than guessing.
