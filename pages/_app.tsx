import { SettingsProvider } from "@/components/Contexts/SettingsContext";
import { clientId } from "@/lib/googlekey";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from "@/components/Contexts/UserContext";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SettingsProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </SettingsProvider>
    </GoogleOAuthProvider>
  );
}
