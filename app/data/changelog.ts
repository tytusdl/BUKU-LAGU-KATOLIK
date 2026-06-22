export interface LocalizedText {
    Melayu: string;
    English: string;
}

export interface ChangeItem {
    text: LocalizedText;
    note?: LocalizedText;
}

export interface ChangelogEntry {
    version: string;
    changes: ChangeItem[];
}

// Add new versions at the top of the list
export const changelogData: ChangelogEntry[] = [
    {
        version: "1.8.0",
        changes: [
            {
                text: {
                    Melayu: "Kelajuan Kategori Lagu: Mengurangkan masa muat kategori sebanyak 88% dengan data ringan tanpa lirik.",
                    English: "Song Category Speed: Reduced category loading time by 88% using lightweight data without lyrics."
                }
            },
            {
                text: {
                    Melayu: "Prestasi App: Memuatkan fon sekali sahaja di peringkat akar untuk navigasi lebih lancar.",
                    English: "App Performance: Fonts now load once at root level for smoother navigation."
                }
            },
            {
                text: {
                    Melayu: "Pembersihan Kod: Memadam fail dan dependensi yang tidak digunakan untuk saiz app lebih kecil.",
                    English: "Code Cleanup: Removed unused files and dependencies for a smaller app size."
                }
            }
        ]
    },
    {
        version: "1.7.0",
        changes: [
            {
                text: {
                    Melayu: "Ciri Baru: TAB SENARAI LAGU - Kini anda boleh merancang lagu Pembukaan, Persembahan, Komuni, dan Penutup untuk Misa.",
                    English: "New Feature: SONG LIST TAB - Now you can plan Opening, Presentation, Communion, and Closing songs for Mass."
                }
            },
            {
                text: {
                    Melayu: "Tetapan Kod Lagu: Tambah kod atau 'key' lagu secara terus dalam perancangan untuk rujukan pemuzik.",
                    English: "Song Key Settings: Add song codes or keys directly in the plan for musician reference."
                }
            },
            {
                text: {
                    Melayu: "Perkongsian Pintas: Kongsi senarai lagu anda dengan mudah melalui format TEKS atau GAMBAR.",
                    English: "Quick Sharing: Easily share your song list via TEXT or IMAGE format."
                }
            },
            {
                text: {
                    Melayu: "Tema Putih (Terbaru): Rekaan grayscale (kelabu/hitam) yang lebih eksklusif dan profesional.",
                    English: "White Theme (New): Exclusive grayscale design (black/gray) for a more professional look."
                }
            }
        ]
    },
    {
        version: "1.6.3.1",
        changes: [
            {
                text: {
                    Melayu: "Tukar nama app ke Buku Lagu Katolik",
                    English: "Changed app name to Buku Lagu Katolik"
                }
            },
            {
                text: {
                    Melayu: "App ada sudah di APPSTORE",
                    English: "App is now available on the App Store"
                }
            },
            {
                text: {
                    Melayu: "Memperbaiki lirik lagu R287",
                    English: "Fixed lyrics for R287"
                }
            }
        ]
    },
    {
        version: "1.6.2",
        changes: [
            {
                text: {
                    Melayu: "Memperbaiki lirik C1, C7, D34, D36, E3, E8, E10, E15, F3, L4, J1, J13, R018, R053, R081, R086, R124, R145, R53, R162, R219, R221, R227, R229, R237 dan R263.",
                    English: "Fixed lyrics for C1, C7, D34, D36, E3, E8, E10, E15, F3, L4, J1, J13, R018, R053, R081, R086, R124, R145, R53, R162, R219, R221, R227, R229, R237, and R263."
                },
                note: {
                    Melayu: "Terima kasih kepada Jicklyn Julian atas pemberitahuan ini",
                    English: "Thanks to Jicklyn Julian for this notification"
                }
            },
            {
                text: {
                    Melayu: "Menambah loading screen app",
                    English: "Added app loading screen"
                }
            },
            {
                text: {
                    Melayu: "Memperbaiki beberapa bugs",
                    English: "Fixed several bugs"
                }
            },
            {
                text: {
                    Melayu: "Menghalang skrin daripada terpadam semasa aplikasi dibuka",
                    English: "Prevented screen from sleeping while app is open"
                }
            },
            {
                text: {
                    Melayu: "Mengubah paparan bahagian chorus menjadi teratur",
                    English: "Changed chorus display to be more organized"
                }
            }
        ]
    },
    // Example for next version:
    /*
    {
      version: "1.6.3",
      changes: [
        {
            text: { Melayu: "...", English: "..." }
        }
      ]
    }
    */
];
