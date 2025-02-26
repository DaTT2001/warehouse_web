import { createContext, useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "app_language";
const DEFAULT_LANG = "vi";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_LANG);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};