import { SettingsProvider } from "@/components/contexts/SettingsContext";
import { clientId } from "@/lib/googlekey";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "@/components/contexts/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}
