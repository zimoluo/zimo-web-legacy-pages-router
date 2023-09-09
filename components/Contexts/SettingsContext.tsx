import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import {
  fetchUploadUserToServerWithOnlyUser,
  modifySessionToken,
} from "@/lib/accountManager";

// Create the context with optional initial values
const SettingsContext = createContext<
  | {
      settings: SettingsState;
      updateSettings: (newSettings: Partial<SettingsState>) => void;
      updateSettingsLocally: (newSettings: Partial<SettingsState>) => void;
    }
  | undefined
>(undefined);

// Provider component
export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setUser } = useUser();

  // Initialize the settings state with default settings
  const [settings, setSettings] = useState<SettingsState>({
    backgroundRichness: "rich",
    syncSettings: true,
    navigationBar: "flexible",
    disableCenterPainting: false,
    disableComments: false,
    disableGestures: false,
    disableSerifFont: false,
  });

  useEffect(() => {
    // This will only run on the client side
    const savedSettings = localStorage.getItem("websiteSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Update settings function
  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };

      // Update the local storage
      localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings));

      const doSyncSettings = updatedSettings.syncSettings;

      if (user !== null) {
        const preparedSettings = doSyncSettings ? updatedSettings : null;
        if (user.websiteSettings === null && preparedSettings === null) {
          return updatedSettings;
        }
        const newUser = { ...user, websiteSettings: preparedSettings };
        setUser(newUser);
        modifySessionToken(newUser);
        if (doSyncSettings) {
          fetchUploadUserToServerWithOnlyUser(newUser);
        }
      }

      return updatedSettings;
    });
  };

  const updateSettingsLocally = (newSettings: Partial<SettingsState>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };

      // Update the local storage
      localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, updateSettingsLocally }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the SettingsContext
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
