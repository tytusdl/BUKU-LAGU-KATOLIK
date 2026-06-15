# 📖 Buku Lagu Katolik (Buku Pozo)

[![Expo SDK 54](https://img.shields.io/badge/Expo-54-green.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue.svg?logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](#)

A modern, fast, and feature-rich Catholic songbook application built using **React Native** and **Expo (SDK 54)**. Designed for parishes and individuals to easily access hymns, liturgies, and personal song collections with offline compatibility.

*Aplikasi buku lagu Katolik moden dan pantas yang dibina menggunakan **React Native** dan **Expo**. Direka khas untuk memudahkan umat mengakses lagu-lagu pujian, liturgi misa, dan koleksi lagu peribadi secara luar talian (offline).*

---

## ✨ Features / Ciri-Ciri Utama

- **🎼 Catholic Hymn Database**: Access a comprehensive library of Catholic songs categorized for easy navigation.
- **🌐 Bilingual Support (Melayu / English)**: Toggle system and song languages dynamically.
- **⛪ Mass Liturgy (Misa)**: Includes guides and readings for holy mass celebrations.
- **✍️ Custom Songs (Lagu Saya)**: Add, edit, and manage your own custom songs locally with persistent storage.
- **❤️ Favorites**: Star and save your favorite songs for quick access.
- **💡 Keep Awake**: Prevents the screen from dimming or turning off while viewing song lyrics.
- **🌓 Dark Mode**: Toggle between light and dark themes for comfortable reading during mass.
- **🔄 Auto-Update Notification**: Prompts users when a new version is available on the Google Play Store or Apple App Store.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Expo SDK 54](https://expo.dev/) (React Native)
- **Routing**: Expo Router (file-based navigation)
- **State Management**: React Context (`ThemeContext`, `LanguageContext`, `MySongsContext`, `MassContext`, `FavoritesContext`)
- **Storage**: `@react-native-async-storage/async-storage` for local settings and custom songs
- **Icons**: `lucide-react-native`
- **Animations**: `react-native-reanimated`

---

## 🚀 Getting Started / Cara Memulakan Projek

### Prerequisites
Make sure you have Node.js and npm installed on your computer.

### 1. Clone & Install
```bash
# Clone the repository (or navigate into the project directory)
cd project

# Install dependencies
npm install
```

### 2. Apply Custom Expo Patches
If there are library or SDK compatibility fixes needed:
```bash
npm run fix
```

### 3. Run Locally (Development)
Start the Expo development server:
```bash
npm run dev
# OR run with auto-fixes and port configuration:
npm run dev:fix
```
Open **Expo Go** on your Android/iOS device and scan the QR code displayed in the terminal to test the app.

---

## 📂 Project Structure / Struktur Projek

```text
project/
├── app/                  # Main Expo Router application files
│   ├── (tabs)/           # Bottom tab navigation screens (Lagu, Misa, Kegemaran, Tetapan)
│   ├── components/       # Reusable UI components (Modals, SongLyrics, etc.)
│   ├── context/          # Global state managers (Theme, Language, Custom Songs, Favorites)
│   ├── data/             # Song databases (songs.ts, songsR.ts) and changelogs
│   ├── edit-song/        # Screens to edit custom user songs
│   └── song/             # Screens for song details and category listings
├── assets/               # Local media assets (webp optimized banners, icons, splash)
├── components/           # Legacy or root components
├── expo-patch.js         # Patch script for Expo configurations
├── app.json              # Expo application metadata configuration
└── package.json          # Dependency and script list
```

---

## 🖼️ Media & Asset Optimization
To keep the binary size minimal, the app uses modern `.webp` formats. You can run the optimized batch script to process assets:
```bash
# Optimize and convert all images to webp
npm run optimize:all
```

---

## 🔒 License
This project is private and proprietary. All rights reserved.
