import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ManagementThemeContext = createContext<
  | {
      managementTheme: "zimo" | "about";
      setManagementTheme: React.Dispatch<
        React.SetStateAction<"zimo" | "about">
      >;
    }
  | undefined
>(undefined);

export function ManagementThemeProvider({ children }: Props) {
  const [managementTheme, setManagementTheme] = useState<"zimo" | "about">(
    "zimo"
  );

  return (
    <ManagementThemeContext.Provider
      value={{ managementTheme, setManagementTheme }}
    >
      {children}
    </ManagementThemeContext.Provider>
  );
}

export const useManagementTheme = () => {
  const context = useContext(ManagementThemeContext);
  if (context === undefined) {
    throw new Error(
      "useManagementTheme must be used within a ManagementThemeProvider"
    );
  }
  return context;
};
