# Memory

Project notes and hard rules that must be followed across sessions.

## Release rule (CRITICAL)

- **Setiap kali ada versi baru (version bump), WAJIB push `version.json` ke
  GitHub branch `master`** (`https://github.com/tytusdl/BUKU-LAGU-KATOLIK`).
- `version.json` di repo public ialah sumber yang dibaca oleh in-app update
  prompt (`app/_layout.tsx`) pada setiap pelancaran app.
- Jika `version.json` tak di-push, fetch ke
  `raw.githubusercontent.com/.../master/version.json` return 404 dan prompt
  update dalam-app senyap mati — pengguna versi lama tak nampak update.
- Verify selepas push:
  `curl -sI https://raw.githubusercontent.com/tytusdl/BUKU-LAGU-KATOLIK/master/version.json`
  (expect HTTP 200, bukan 404).
- Urutan release: bump `package.json` + `app.json` -> edit `changelog.ts` ->
  edit `version.json` -> `tsc --noEmit` + `lint` -> **commit & push
  `version.json` ke master** -> `eas build` -> `eas submit`.

## Build / submit

- iOS submit guna `eas submit --platform ios --id <build-id> --wait`
  (flag ialah `--id`, bukan `--build-id`).
- Build 1.9.1 (build number 1.6.13, commit `be42c4d`) dihantar ke App Store
  Connect pada 16/8/2026.
