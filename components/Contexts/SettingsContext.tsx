import { getCookie, setCookie } from '@/lib/CookieHandler';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const SettingsContext = createContext<SettingsData | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export function SettingsProvider({ children }: Props) {
  const [minimalBackground, setMinimalBackground] = useState<boolean>(
    getCookie('minimalBackground') !== null ? getCookie('minimalBackground') === 'true' : false
  );

  useEffect(() => {
    setCookie('minimalBackground', minimalBackground);
  }, [minimalBackground]);

  const toggleMinimalBackground = () => {
    setMinimalBackground(!minimalBackground);
  };

  return (
    <SettingsContext.Provider value={{ minimalBackground, toggleMinimalBackground }}>
      {children}
    </SettingsContext.Provider>
  );
}
