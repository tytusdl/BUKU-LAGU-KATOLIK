import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci untuk menyimpan data di AsyncStorage
const LYRICS_REPORT_STORAGE_KEY = 'lyrics_reports';

// Jenis-jenis masalah lirik yang boleh dilaporkan
export type LyricsReportType =
  | 'wrong_word'
  | 'missing_line'
  | 'extra_line'
  | 'chords'
  | 'other';

// Definisi satu laporan lirik
export interface LyricsReport {
  id: string;                 // unique id (timestamp)
  songId: string;             // ID lagu (cth: A1, R287)
  songTitle: string;          // Tajuk lagu (untuk paparan)
  type: LyricsReportType;     // Jenis masalah
  description: string;        // Penerangan bebas dari user
  contact: string;            // Nama/emel user (boleh kosong)
  createdAt: number;          // Unix ms
  appVersion: string;         // Versi app semasa laporan
  language: 'Melayu' | 'English'; // Bahasa UI semasa laporan
}

// Definisi jenis context
type LyricsReportContextType = {
  reports: LyricsReport[];
  addReport: (report: Omit<LyricsReport, 'id' | 'createdAt'>) => Promise<LyricsReport>;
  removeReport: (reportId: string) => Promise<void>;
  clearAllReports: () => Promise<void>;
  exportReportsAsText: () => Promise<string>;
};

// Default context value
const LyricsReportContext = createContext<LyricsReportContextType>({
  reports: [],
  addReport: async () => {
    throw new Error('LyricsReportProvider not initialized');
  },
  removeReport: async () => {},
  clearAllReports: async () => {},
  exportReportsAsText: async () => '',
});

// Hook untuk menggunakan context
export const useLyricsReports = () => useContext(LyricsReportContext);

// Props untuk provider
type LyricsReportProviderProps = {
  children: ReactNode;
};

// Format satu laporan ke teks (untuk emel/export)
const formatReportAsText = (report: LyricsReport, lang: 'Melayu' | 'English'): string => {
  const typeLabels: Record<LyricsReportType, { Melayu: string; English: string }> = {
    wrong_word: { Melayu: 'Salah ejaan / perkataan', English: 'Spelling / word error' },
    missing_line: { Melayu: 'Baris lirik hilang', English: 'Missing line' },
    extra_line: { Melayu: 'Baris lagu berlebihan', English: 'Extra line' },
    chords: { Melayu: 'Masalah kod lagu / key', English: 'Chord / key issue' },
    other: { Melayu: 'Masalah lain', English: 'Other issue' },
  };

  const headerLabel = lang === 'Melayu' ? 'LAPORAN LIRIK' : 'LYRICS REPORT';
  const songLabel = lang === 'Melayu' ? 'Lagu' : 'Song';
  const typeLabel = lang === 'Melayu' ? 'Jenis' : 'Type';
  const descLabel = lang === 'Melayu' ? 'Penerangan' : 'Description';
  const contactLabel = lang === 'Melayu' ? 'Nama / Emel' : 'Name / Email';
  const dateLabel = lang === 'Melayu' ? 'Tarikh' : 'Date';
  const appLabel = lang === 'Melayu' ? 'Versi Aplikasi' : 'App Version';

  const date = new Date(report.createdAt);
  const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return [
    `=== ${headerLabel} ===`,
    `${songLabel}: ${report.songId} - ${report.songTitle}`,
    `${typeLabel}: ${typeLabels[report.type][lang]}`,
    `${descLabel}: ${report.description}`,
    `${contactLabel}: ${report.contact || (lang === 'Melayu' ? '(tiada)' : '(none)')}`,
    `${dateLabel}: ${dateStr}`,
    `${appLabel}: ${report.appVersion}`,
    '',
  ].join('\n');
};

// Provider component
export const LyricsReportProvider = ({ children }: LyricsReportProviderProps) => {
  const [reports, setReports] = useState<LyricsReport[]>([]);

  // Muat laporan dari AsyncStorage semasa komponen dimuat
  useEffect(() => {
    const loadReports = async () => {
      try {
        const stored = await AsyncStorage.getItem(LYRICS_REPORT_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as LyricsReport[];
          // Susun descending mengikut tarikh (terbaru di atas)
          parsed.sort((a, b) => b.createdAt - a.createdAt);
          setReports(parsed);
        }
      } catch (error) {
        console.log('Error loading lyrics reports:', error);
      }
    };

    loadReports();
  }, []);

  // Simpan ke AsyncStorage
  const saveReports = async (newReports: LyricsReport[]) => {
    try {
      await AsyncStorage.setItem(LYRICS_REPORT_STORAGE_KEY, JSON.stringify(newReports));
    } catch (error) {
      console.log('Error saving lyrics reports:', error);
    }
  };

  // Tambah laporan baru
  const addReport = async (report: Omit<LyricsReport, 'id' | 'createdAt'>): Promise<LyricsReport> => {
    const newReport: LyricsReport = {
      ...report,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      createdAt: Date.now(),
    };
    const newReports = [newReport, ...reports];
    setReports(newReports);
    await saveReports(newReports);
    return newReport;
  };

  // Padam satu laporan
  const removeReport = async (reportId: string) => {
    const newReports = reports.filter(r => r.id !== reportId);
    setReports(newReports);
    await saveReports(newReports);
  };

  // Padam semua laporan
  const clearAllReports = async () => {
    setReports([]);
    await saveReports([]);
  };

  // Eksport semua laporan sebagai teks (untuk clipboard / emel)
  const exportReportsAsText = async (): Promise<string> => {
    if (reports.length === 0) return '';

    // Kumpul mengikut bahasa majoriti (gunakan bahasa laporan pertama)
    const lang = reports[0]?.language || 'English';
    const header = lang === 'Melayu'
      ? `=== SENARAI LAPORAN LIRIK (${reports.length}) ===`
      : `=== LYRICS REPORT LIST (${reports.length}) ===`;

    const body = reports.map(r => formatReportAsText(r, r.language)).join('\n');
    return `${header}\n\n${body}`;
  };

  const value = {
    reports,
    addReport,
    removeReport,
    clearAllReports,
    exportReportsAsText,
  };

  return (
    <LyricsReportContext.Provider value={value}>
      {children}
    </LyricsReportContext.Provider>
  );
};

export default LyricsReportProvider;