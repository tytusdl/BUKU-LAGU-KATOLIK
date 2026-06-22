import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci untuk menyimpan data di AsyncStorage
const MASS_STORAGE_KEY = 'mass_selection';

export type MassSongSelection = {
    songId: string;
    songKey: string;
};

export type MassSelection = {
    pembukaan: MassSongSelection[];
    punggutan: MassSongSelection[];
    persembahan: MassSongSelection[];
    komuni: MassSongSelection[];
    kesyukuran: MassSongSelection[];
    penutup: MassSongSelection[];
};

type MassContextType = {
    massSelection: MassSelection;
    addSongToMassPart: (part: keyof MassSelection, songId: string) => Promise<void>;
    removeSongFromMassPart: (part: keyof MassSelection, songId: string) => Promise<void>;
    updateSongKeyInMassPart: (part: keyof MassSelection, songId: string, songKey: string) => Promise<void>;
    reorderMassPart: (part: keyof MassSelection, newSelections: MassSongSelection[]) => Promise<void>;
    clearMassSelection: () => Promise<void>;
};

const defaultMassSelection: MassSelection = {
    pembukaan: [],
    punggutan: [],
    persembahan: [],
    komuni: [],
    kesyukuran: [],
    penutup: [],
};

const MassContext = createContext<MassContextType>({
    massSelection: defaultMassSelection,
    addSongToMassPart: async () => { },
    removeSongFromMassPart: async () => { },
    updateSongKeyInMassPart: async () => { },
    reorderMassPart: async () => { },
    clearMassSelection: async () => { },
});

export const useMass = () => useContext(MassContext);

type MassProviderProps = {
    children: ReactNode;
};

export const MassProvider = ({ children }: MassProviderProps) => {
    const [massSelection, setMassSelection] = useState<MassSelection>(defaultMassSelection);

    useEffect(() => {
        const loadMassSelection = async () => {
            try {
                const stored = await AsyncStorage.getItem(MASS_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);

                    // Simple migration logic if older data format (null or generic single object)
                    const migrated: MassSelection = { ...defaultMassSelection };
                    for (const key of Object.keys(defaultMassSelection)) {
                        const part = key as keyof MassSelection;
                        if (parsed[part]) {
                            if (Array.isArray(parsed[part])) {
                                migrated[part] = parsed[part];
                            } else if (parsed[part].songId) {
                                // Was a single object previously
                                migrated[part] = [parsed[part]];
                            }
                        }
                    }
                    setMassSelection(migrated);
                }
            } catch (error) {
                console.log('Error loading mass selection:', error);
            }
        };

        loadMassSelection();
    }, []);

    const saveAndSetSelection = async (newSelection: MassSelection) => {
        setMassSelection(newSelection);
        try {
            await AsyncStorage.setItem(MASS_STORAGE_KEY, JSON.stringify(newSelection));
        } catch (error) {
            console.log('Error saving mass selection:', error);
        }
    };

    const addSongToMassPart = async (part: keyof MassSelection, songId: string) => {
        const partSongs = massSelection[part] || [];
        if (!partSongs.some(s => s.songId === songId)) {
            const newSelection = {
                ...massSelection,
                [part]: [...partSongs, { songId, songKey: '' }]
            };
            await saveAndSetSelection(newSelection);
        }
    };

    const removeSongFromMassPart = async (part: keyof MassSelection, songId: string) => {
        const partSongs = massSelection[part] || [];
        const newSelection = {
            ...massSelection,
            [part]: partSongs.filter(s => s.songId !== songId)
        };
        await saveAndSetSelection(newSelection);
    };

    const updateSongKeyInMassPart = async (part: keyof MassSelection, songId: string, songKey: string) => {
        const partSongs = massSelection[part] || [];
        const newSelection = {
            ...massSelection,
            [part]: partSongs.map(s => s.songId === songId ? { ...s, songKey } : s)
        };
        await saveAndSetSelection(newSelection);
    };

    const reorderMassPart = async (part: keyof MassSelection, newSelections: MassSongSelection[]) => {
        const newSelection = {
            ...massSelection,
            [part]: newSelections
        };
        await saveAndSetSelection(newSelection);
    };

    const clearMassSelection = async () => {
        setMassSelection(defaultMassSelection);
        try {
            await AsyncStorage.removeItem(MASS_STORAGE_KEY);
        } catch (error) {
            console.log('Error clearing mass selection:', error);
        }
    };

    return (
        <MassContext.Provider value={{
            massSelection,
            addSongToMassPart,
            removeSongFromMassPart,
            updateSongKeyInMassPart,
            reorderMassPart,
            clearMassSelection
        }}>
            {children}
        </MassContext.Provider>
    );
};

export default MassProvider;
