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
        version: "1.9.0",
        changes: [
            {
                text: {
                    Melayu: "Ciri Baru - Lapor Lirik: Sekarang anda boleh melaporkan masalah lirik lagu (salah ejaan, baris hilang, masalah kod lagu, dll) terus dari halaman detail lagu.",
                    English: "New Feature - Lyrics Report: You can now report song lyrics issues (spelling errors, missing lines, chord issues, etc.) directly from the song detail page."
                }
            },
            {
                text: {
                    Melayu: "Senarai Laporan di Tetapan: Lihat semua laporan lirik yang dihantar dari peranti ini, dengan pilihan eksport atau padam laporan.",
                    English: "Reports List in Settings: View all lyrics reports submitted from this device, with options to export or delete reports."
                }
            },
            {
                text: {
                    Melayu: "Penghantaran Pintar: Laporan disimpan dalam peranti dan boleh dihantar terus ke emel pembangun dengan metadata lagu yang lengkap.",
                    English: "Smart Delivery: Reports are saved on this device and can be sent directly to the developer's email with complete song metadata."
                }
            },
            {
                text: {
                    Melayu: "Hubungi Saya Dipermudahkan: Menu 'Hubungi Saya' kini gabungan — pilih 'Pertanyaan Umum' untuk emel biasa atau 'Lapor Lirik' untuk panduan melaporkan masalah lirik dari halaman lagu.",
                    English: "Simplified Contact: 'Contact Me' menu is now combined — choose 'General Inquiry' for regular email, or 'Report Lyrics' for guidance on reporting lyrics issues from the song page."
                }
            }
        ]
    },
    {
        version: "1.8.0",
        changes: [
            {
                text: {
                    Melayu: "Peningkatan Prestasi: Muat lebih cepat, guna lebih ringan. Nikmati pengalaman baru yang lebih smooth!",
                    English: "Performance Upgrade: Loads faster, runs lighter. Enjoy a smoother experience!"
                }
            },
            {
                text: {
                    Melayu: "Senarai Lagu Misa: Menambah bahagian 'Lagu Kesyukuran' selepas bahagian Lagu Komuni di bawah perancangan Senarai Lagu.",
                    English: "Mass Song List: Added the 'Thanksgiving Song' section after the Communion Song section in the Song List planner."
                }
            },
            {
                text: {
                    Melayu: "Sistem Navigasi Android: Memperbaiki isu tab menu bertindih dengan butang navigasi sistem Android pada sesetengah peranti.",
                    English: "Android Navigation System: Fixed overlapping issue between the bottom tab bar and Android system navigation buttons."
                }
            },
            {
                text: {
                    Melayu: "Kestabilan Aplikasi: Memperbaiki ralat 'Unable to activate keep awake' yang menyebabkan aplikasi tergendala semasa dimulakan.",
                    English: "App Stability: Fixed 'Unable to activate keep awake' error that caused app crashes on startup."
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
