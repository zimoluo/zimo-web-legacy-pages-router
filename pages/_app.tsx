import { SettingsProvider } from "@/components/contexts/SettingsContext";
import { clientId } from "@/lib/googlekey";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "@/components/contexts/UserContext";
import { ManagementThemeProvider } from "@/components/contexts/ManagementThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is undefined!");
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <SettingsProvider>
          <ManagementThemeProvider>
            <Component {...pageProps} />
          </ManagementThemeProvider>
        </SettingsProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}
