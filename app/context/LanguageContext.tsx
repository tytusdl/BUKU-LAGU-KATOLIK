import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../../src/translations';

type Language = 'Melayu' | 'English';

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('Melayu');

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem('app-language');
                if (storedLanguage && (storedLanguage === 'Melayu' || storedLanguage === 'English')) {
                    setCurrentLanguage(storedLanguage as Language);
                }
            } catch (error) {
                console.error('Failed to load language', error);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem('app-language', lang);
            setCurrentLanguage(lang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    const t = useCallback((key: string, params?: Record<string, string>) => {
        const translation = translations[currentLanguage]?.[key as keyof typeof translations['Melayu']] || key;

        if (params) {
            let result = translation;
            Object.entries(params).forEach(([paramKey, value]) => {
                result = result.replace(`{${paramKey}}`, value);
            });
            return result;
        }

        return translation;
    }, [currentLanguage]);

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
