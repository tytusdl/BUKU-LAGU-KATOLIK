# 📖 Buku Lagu Katolik (Buku Pozo)

[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK_54-000020.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB.svg?logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hermes](https://img.shields.io/badge/JS_Engine-Hermes-FF6F61.svg)](https://hermesengine.dev/)
[![New Architecture](https://img.shields.io/badge/RN-New_Architecture_Enabled-blueviolet.svg)](https://reactnative.dev/docs/the-new-architecture/landing-page)
[![Version](https://img.shields.io/badge/Version-1.9.0-success.svg)](#-changelog)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](#-license)

A modern, fast, and feature-rich Catholic songbook application built with **React Native** and **Expo SDK 54**. Designed for parishes and individuals to easily browse hymns, plan mass liturgy, share lyrics, and curate personal song collections — fully offline-first.

*Aplikasi buku lagu Katolik moden dan pantas yang dibina menggunakan **React Native** dan **Expo**. Direka khas untuk memudahkan umat mengakses lagu-lagu pujian, merancang liturgi misa, berkongsi lirik, dan mengurus koleksi lagu peribadi — secara luar talian (offline-first).*

---

## ✨ Features / Ciri-Ciri Utama

### Song Library & Browsing
- **🎼 Catholic Hymn Database** — curated library of Catholic songs organized into categories (Misa, Adven, Paskah, Marian, etc.) for fast navigation.
- **🗂️ Categorized Browsing** — browse songs by category with dedicated category pages; quick-jump from song list.
- **📑 Indexed Song List** — lightweight `songIndex` (id + title + number) loads instantly for category/search lists; full lyrics pulled only on the song detail screen for fast scrolling.
- **🔤 Bilingual Lyrics Display** — toggle between Malay and English UI; lyrics follow the active language where available.
- **🔎 Persistent Navigation State** — `freezeOnBlur` on tabs keeps scroll positions intact when switching between Lagu, Kegemaran, Misa, and Tetapan.

### Mass Liturgy (Misa)
- **⛪ Mass Planner** — dedicated "Senarai Lagu Misa" tab to plan Opening, Presentation (Persembahan), Communion (Komuni), Thanksgiving (Kesyukuran), and Closing (Penutup) songs for a celebration.
- **🎵 Per-Slot Song Key** — attach a musical key (kod lagu) to each slot for musician reference.
- **📤 Share Mass List** — share the full mass plan as formatted text or rendered image via the system share sheet.
- **➕ Add From Detail** — pick any song from its detail page and drop it straight into the active mass slot.

### Custom Songs (Lagu Saya)
- **✍️ Personal Song Library** — add, edit, and delete your own custom songs entirely on-device.
- **📋 Two Ways To Add** — type lyrics manually, or paste shared content from the clipboard.
- **🔗 Share-In Detection** — opening a `lagu-pozoo://savesong?data=…` deep link automatically lands on the import sheet with the lyrics pre-filled.

### Sharing & Collaboration
- **🔗 Share Lyrics (Text + Image)** — share a song as plain text or as a styled PNG render via WhatsApp, Telegram, email, etc.
- **🪪 Song ID Encoding** — shared links embed the song ID, so the recipient's app jumps straight to that song.
- **📥 Receive Shared Links** — pasting a song link into the app triggers a preview modal with one-tap "Save to my songs" or "Open now".

### Reporting & Quality
- **🚩 Report Lyrics Issues** — flag typos, missing lines, or chord problems directly from the song detail page; reports include song ID, title, issue type, and app version automatically.
- **📬 Local Reports Inbox** — submitted reports are stored on-device and viewable in Settings with export / delete actions.
- **✉️ Email Delivery** — reports can be sent straight to the developer's inbox with full metadata attached.

### Personalization & UX
- **❤️ Favorites** — star songs for one-tap access from the dedicated "Kegemaran" tab.
- **🌓 Light / Dark Mode** — system follow or manual override; dark mode is the inverted base palette.
- **🎨 Multiple Color Themes** — pick from several accent palettes, including the new exclusive grayscale theme.
- **🌐 Language Toggle** — Melayu ⇄ English on the fly without restart.
- **💡 Keep Awake** — screen stays on while you're viewing lyrics during mass (uses `expo-keep-awake`).
- **📱 Native Gestures** — smooth hardware-accelerated transitions powered by `react-native-reanimated` + Worklets.
- **🔒 Font Scaling Cap** — Android system font scale is clamped to prevent lyric layouts from breaking on devices with very large system fonts.

### Updates & Distribution
- **🔄 Store-Version Check** — on launch, the app fetches a `version.json` from the project repo and surfaces an update modal when the store has a newer release (Play Store / App Store links bundled).
- **📦 In-App Changelog** — view the full bilingual version history inside Settings.
- **🛠️ EAS Build & OTA** — Expo Application Services handles native builds; OTA updates are delivered via `expo-updates` for fast fixes.

### Deep Linking
- **🔗 Custom URL Scheme** — `lagu-pozoo://` is registered on both Android and iOS for opening specific screens and saving shared songs from external apps.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
| --- | --- |
| **Framework** | [Expo SDK 54](https://expo.dev/) (React Native 0.81.5, React 19.1, Hermes, New Architecture enabled) |
| **Language** | TypeScript 5.9 (strict) — `@tsconfig/react-native`, path alias `@/*` → repo root |
| **Routing** | `expo-router` v6 — file-based, typed routes, route group `(tabs)`, dynamic routes `song/[id]`, `song/category/[id]`, `edit-song/[id]` |
| **State** | React Context only — `ThemeContext`, `LanguageContext`, `FavoritesContext`, `MySongsContext`, `MassContext`, `LyricsReportContext`. No Redux/Zustand. |
| **Persistence** | `@react-native-async-storage/async-storage` — one key per feature (e.g. `theme_mode`, `color_theme`, `my_songs`, `ignored_version`) |
| **Icons** | `lucide-react-native` |
| **Animations** | `react-native-reanimated` v4 + `react-native-worklets` |
| **Fonts** | `@expo-google-fonts/inter` (400 / 600 / 700, Latin subset) |
| **Sharing** | `expo-sharing`, `expo-clipboard`, `react-native-view-shot`, `react-native-svg` |
| **Updates** | `expo-updates` (OTA) + raw `version.json` store check |
| **Build / Ship** | EAS Build — project id `e7ba5e9f-7429-4986-8ab7-a42245d0d561`, slug `lagu_pozoo`, bundle id `com.tytusdl.lagu_pozoo` / `com.tytusdl.lagu-pozoo` |

---

## 🚀 Getting Started / Cara Memulakan Projek

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your computer.

### 1. Install dependencies
```bash
npm install
```

> 💡 On Windows, if `npx expo install` trips on the user-level `.npmrc` setting
> `allow-scripts=opencode-ai` and fails with `EALLOWSCRIPTS`, fall back to plain
> `npm install --save` / `--save-dev`. The project's `node_modules` builds fine
> that way.

### 2. Apply local Expo patch (Windows only)
```bash
npm run fix
```
This writes the local IPv4 into `./.expo/ip.txt` so the QR code resolves correctly.
**Safe to delete on macOS/Linux.**

### 3. Run locally (development)
```bash
npm run dev          # clear cache + start
npm run dev:fix      # patch + start on port 8082 (use on Windows)
npm run web          # web build via Metro
npm run build:web    # expo export --platform web → dist/
npm run lint         # expo lint (installs ESLint on first run)
npx tsc --noEmit     # type-check without emitting
```
Open **Expo Go** on your Android/iOS device and scan the QR code displayed in the
terminal to test the app.

---

## 📂 Project Structure / Struktur Projek

```text
buku-lagu-katolik/
├── app/                         # expo-router routes (file-based)
│   ├── _layout.tsx              # root: providers + splash + update check + deep links
│   ├── +not-found.tsx
│   ├── (tabs)/                  # bottom-tab screens (freezeOnBlur)
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Lagu — song list / categories
│   │   ├── favorites.tsx        # Kegemaran
│   │   ├── misa.tsx             # Mass planner
│   │   └── setting.tsx          # Tetapan
│   ├── song/
│   │   ├── [id]/index.tsx       # Song detail (lyrics + share + report)
│   │   └── category/[id].tsx    # Category listing
│   ├── edit-song/[id].tsx       # Edit a custom song
│   ├── my-songs.tsx             # User-added song list + add sheet
│   ├── add-song.tsx             # Add a new custom song
│   ├── components/              # Shared UI: SongLyrics, Lyrics, UpdateModal,
│   │                            # ChangelogModal, ShareBottomSheet,
│   │                            # SharedLinkPreviewModal, ReportLyricsModal,
│   │                            # LyricsReportsListModal, ContactModal,
│   │                            # PageHeader, ConfirmDialog, ShareHelpModal
│   ├── context/                 # Context providers (Theme, Language,
│   │                            # Favorites, MySongs, Mass, LyricsReport)
│   ├── data/
│   │   ├── songs/
│   │   │   ├── songs.ts         # main Song DB (full lyrics, ~6.5k lines)
│   │   │   ├── songsR.ts        # extended/secondary Song DB
│   │   │   ├── songIndex.ts     # lightweight id+title+number index (no lyrics)
│   │   │   └── index.ts         # re-exports
│   │   ├── changelog.ts         # in-app changelog history
│   │   └── contributors.ts
│   └── utils/
│       ├── imageCache.ts        # banner image cache (cacheImages)
│       ├── songLink.ts          # parseSongShareLink (lagu-pozoo:// decoding)
│       └── recentShares.ts      # recent share recents
├── assets/images/               # icons, splash, category banners (WebP)
├── components/
│   └── AnimatedSplash.tsx       # root splash animation (overlay sibling)
├── src/
│   └── translations.ts          # i18n strings keyed by 'Melayu' | 'English'
├── app.json                     # Expo metadata (scheme, plugins, icons, splash)
├── eas.json                     # EAS Build profiles
├── babel.config.js              # babel-plugin-transform-remove-console
├── metro.config.js
├── tsconfig.json                # extends @tsconfig/react-native, path alias @/*
├── eslint.config.js             # eslint-config-expo
├── expo-patch.js                # Windows IPv4 patch (see step 2 above)
├── buku_pozoo.js                # Expo Router entry (used by main field)
├── optimize_all_images.ps1      # Powershell WebP batch script
├── version.json                 # store-version check payload
├── AGENTS.md                    # agent guidance (agents.md spec)
└── package.json
```

### Key Conventions
- **Bilingual by design**: every user-facing string lives in `src/translations.ts` keyed by `'Melayu'` and `'English'`. New keys go at the end of each block to keep diffs small.
- **Theme colors** are read via `useTheme().currentColorTheme` — no hardcoded hex outside `ThemeContext.tsx`.
- **Song IDs** are stable, source-of-truth is `songIndex.ts`. New songs append, never renumber. The prefix letter of `id` must match `songNumber`.
- **List views** import from `songIndex.ts` (no lyrics); only the song detail screen pulls the full `Song` from `songs.ts` / `songsR.ts`.
- **Deep links** route through `RootLayout.processDeepLink` — extend there rather than re-handling in screens.

---

## 🖼️ Media & Asset Optimization

To keep binary size minimal, all banners and category art are stored as WebP. You
can re-run the conversion batch from the project root:

```bash
npm run optimize:all
```

This invokes `optimize_all_images.ps1`, which uses `sharp-cli` to re-encode PNGs
under `assets/images/` to WebP at quality 80. Not part of the normal dev loop —
run it manually when you add new artwork.

---

## 🏗️ Build Flow / Aliran Build

Semua build dijalankan melalui **Expo Application Services (EAS)** — tak perlu
install Xcode atau Android Studio untuk produce release artifact. EAS run build
atas cloud server, kau boleh trigger dari CLI.

### Prerequisites / Prasyarat
- **EAS CLI** (untuk submit command): `npm install -g eas-cli`
- **Expo account**: daftar di [expo.dev](https://expo.dev/signup) dan link ke
  project ini (`eas login`).
- Project ID dah dikonfig: `e7ba5e9f-7429-4986-8ab7-a42245d0d561` (lihat
  `app.json` → `extra.eas.projectId`).

### Build profiles / Profil Build

Profil didefinisikan dalam `eas.json`:

| Profile       | Distribution | Output                              | Kegunaan                        |
| ------------- | ------------ | ----------------------------------- | ------------------------------- |
| `development` | internal     | Dev client (debug-enabled)          | Local development dengan native |
| `preview`     | internal     | Android `.apk` + iOS `.ipa` (ad-hoc)| QA testing, internal review     |
| `production`  | store        | Android `.aab` + iOS `.ipa` (release)| Submit ke Play Store / App Store |

### Android Build / Build Android

#### Preview (APK untuk testing dalaman)
```bash
eas build --platform android --profile preview
```
Output: `.apk` file. Boleh install terus ke device Android (sideload) tanpa
Play Store. Sesuai untuk uji kat device sendiri atau share dengan testers
melalui WhatsApp / Google Drive.

#### Production (AAB untuk Play Store)
```bash
eas build --platform android --profile production
```
Output: `.aab` (Android App Bundle). Wajib format ni untuk upload ke
**Google Play Console**. EAS akan auto-increment `versionCode` sebab config
`autoIncrement: true` dalam `eas.json`.

#### Submit ke Play Store
```bash
eas submit --platform android --latest
```
Kena setup **service account JSON** dulu dalam
[EAS dashboard](https://expo.dev/accounts/[account]/projects/lagu_pozoo/settings/submissions)
sebelum submit command boleh auto-upload. Ikut
[panduan Play Store API](https://docs.expo.dev/submit/android/) untuk setup.

### iOS Build / Build iOS

#### Preview (untuk internal testing)
```bash
eas build --platform ios --profile preview
```
Output: `.ipa` file. Untuk install ke iPhone sebenar, device kena
**daftarkan UDID** dulu dalam Apple Developer account. EAS handle auto
register kalau kau pass `--auto-submit-with-profile` atau configure
`eas.json:build.preview.ios.distributionCertificate`.

Atau alternatif lebih senang untuk testing — guna **TestFlight**:
```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```
Upload ke App Store Connect, kemudian add testers dalam TestFlight app.

#### Production (untuk App Store)
```bash
eas build --platform ios --profile production
```
Output: `.ipa` signed dengan distribution certificate. Submit command:
```bash
eas submit --platform ios --latest
```
`appVersionSource: "remote"` dalam `eas.json` bermaksud EAS akan
auto-increment `buildNumber` dari server. App Store Connect App ID dah
dikonfig: `6759234151` (lihat `eas.json:submit.production.ios.ascAppId`).

#### Certificate & provisioning
Kali pertama je perlu setup — EAS ada wizard interaktif:
```bash
eas credentials:configure --platform ios
```
Sama ada guna **credentials auto-managed** (EAS handle semua cert +
provisioning profile untuk kau, recommended) atau upload cert manual.

### Tips / Tip Berguna

- **Build pertama memang lambat** (~10-20 minit untuk iOS sebab EAS perlu
  download + cache semua dependency). Build kedua dan seterusnya akan
  lebih cepat sebab cache.
- **Local build** guna `expo run:android` / `expo run:ios` dalam `package.json`
  scripts — tapi ni perlukan Xcode/Android Studio locally dan hanya untuk
  development, tak sesuai untuk release artifact.
- **Auto-increment version**: `production` profile dah set
  `autoIncrement: true` untuk Android, jadi jangan manual edit
  `versionCode` dalam `app.json` — biar EAS handle.
- **Check status**: `eas build:list` untuk tengok semua build history
  dan download artifact link.

---

## 🚢 Release Flow / Aliran Release

> ⚠️ **WAJIB: Push `version.json` ke `master` setiap release.**
> App ni fetch `version.json` dari
> `https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json`
> setiap kali user buka app. Kalau repo private (atau file tak push),
> fetch return 404 dan **in-app update prompt mati senyap** — user v1.8.0
> ke bawah langsung tak tahu v1.9.0 dah keluar. Lepas push, check URL
> tu boleh akses (HTTP 200, bukan 404). Jangan skip step ni untuk
> release kecik-kecik sekali.

1. Bump `version` in `package.json`, `app.json` (and `ios.buildNumber`).
2. Edit `app/data/changelog.ts` — add a new entry at the top of `changelogData`
   with bilingual `text` per change.
3. Edit the root `version.json` — bump `version`, add `releaseNotes` in both
   languages, decide `forceUpdate` and `minVersion`.
4. Run `npx tsc --noEmit` and `npm run lint`; both must pass.
5. **Commit AND push `version.json` to `master` on the public repo.**
   Verify with: `curl -sI https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json`
   — must return `HTTP/2 200`, not 404. Without this push, users on the
   previous version never see the in-app update modal.
6. Commit on a branch, push, then:
   ```bash
   eas build --profile preview    # internal testing
   eas build --profile production # store release
   ```

---

## 📜 Changelog / Sejarah Versi

Highlights — full bilingual changelog lives in `app/data/changelog.ts`.

### 1.9.0 — Lyrics Report
- New "Lapor Lirik" flow from the song detail page (typos, missing lines, chord issues).
- "Laporan Lirik" inbox in Settings — view, export, or delete reports submitted from this device.
- Reports auto-include song ID, title, issue type, and app version.
- Streamlined "Hubungi Saya" menu — General Inquiry vs. Report Lyrics.

### 1.8.0 — Performance & Polish
- 88% faster category-load via the lightweight `songIndex`.
- New "Lagu Kesyukuran" slot in the Mass planner.
- Fixed Android bottom-tab overlap with system navigation buttons.
- Fixed "Unable to activate keep awake" startup crash.

### 1.7.0 — Mass Planner & Themes
- Dedicated Mass Song List tab with Opening / Presentation / Communion / Closing slots.
- Per-slot song key for musicians.
- Share mass plans as TEXT or IMAGE.
- New exclusive grayscale theme.

### 1.6.x — Foundation
- Custom user songs, keep-awake, organized chorus display, song-lyrics corrections, App Store release, rename to *Buku Lagu Katolik*.

---

## 🔒 License

This project is **private and proprietary**. All rights reserved.