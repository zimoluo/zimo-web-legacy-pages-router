import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";
import BackgroundAnimation from "./BackgroundAnimation";
import {
  ThemeType,
  textColorMap,
  simpleTitleMap,
  siteThemeColorMap,
  websiteFaviconDirectory,
} from "../interfaces/themeMaps";
import { useUser } from "./contexts/UserContext";
import { restoreClientUser } from "@/lib/accountClientManager";
import { useEffect, useState } from "react";
import { useSettings } from "./contexts/SettingsContext";
import { defaultSettings } from "@/interfaces/defaultSettings";
import HalloweenPulse from "./HalloweenPulse";
import { isHalloweenDay, isHalloweenSeason } from "@/lib/seasonUtil";

interface LayoutProps {
  theme: ThemeType;
  children: React.ReactNode;
  className?: string;
}

const MainPageLayout: React.FC<LayoutProps> = ({
  theme,
  children,
  className = "",
}) => {
  const { user, setUser } = useUser();
  const { updateSettingsLocally, settings } = useSettings();
  const [isHalloweenDayClient, setIsHalloweenDayClient] = useState(false);
  const [isHalloweenSeasonClient, setIsHalloweenSeasonClient] = useState(false);

  useEffect(() => {
    setIsHalloweenDayClient(isHalloweenDay());
    setIsHalloweenSeasonClient(isHalloweenSeason());
  }, []);

  useEffect(() => {
    async function restoreUserInfo() {
      if (user !== null) return;

      try {
        const savedRawSettings = localStorage.getItem("websiteSettings");
        const loadedSettings = savedRawSettings
          ? JSON.parse(savedRawSettings)
          : defaultSettings;

        const restoredUserInfo = await restoreClientUser(loadedSettings);

        if (!restoredUserInfo) {
          console.log(
            "Encountered an unexpected error while trying to restore user session."
          );
          return;
        }

        if (!restoredUserInfo.exists) {
          console.log("No user session found.");
          return;
        }

        const { integratedUser, downloadedSettings } = restoredUserInfo;

        setUser(integratedUser);
        if (downloadedSettings !== null) {
          updateSettingsLocally(downloadedSettings);
        }
      } catch (error) {
        console.error("Error in restoring user session:", error);
      }
    }

    restoreUserInfo();
  }, []);

  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const faviconDir =
    websiteFaviconDirectory[theme] || websiteFaviconDirectory["zimo"];
  const simpleTitle = simpleTitleMap[theme] || simpleTitleMap["zimo"];
  const siteThemeColor = siteThemeColorMap[theme] || siteThemeColorMap["zimo"];

  return (
    <main className="flex flex-col min-h-screen">
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${faviconDir}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`${faviconDir}/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="1024x1024"
          href={`${faviconDir}/favicon-1024x1024.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${faviconDir}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${faviconDir}/android-chrome-192x192.png`}
        />
        <meta name="msapplication-TileColor" content={siteThemeColor} />
        <meta
          name="msapplication-TileImage"
          content={`${faviconDir}/mstile-144x144.png`}
        />

        <title>{simpleTitle}</title>
        <meta property="og:site_name" content="Zimo Web" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={siteThemeColor} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="author" content="Zimo" />
      </Head>
      {((settings.enableHalloweenEffect && isHalloweenSeasonClient) ||
        isHalloweenDayClient) && <HalloweenPulse />}
      <BackgroundImage theme={theme} />
      <BackgroundAnimation theme={theme} />
      <Navbar theme={theme} />
      <div className={`font-arial ${textColorClass} ${className}`}>
        {children}
      </div>
      <div
        className="select-none pointer-events-none flex-grow"
        aria-hidden="true"
      />
      <Footer theme={theme} />
    </main>
  );
};

export default MainPageLayout;
