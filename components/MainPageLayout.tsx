import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";
import BackgroundAnimation from "./BackgroundAnimation";
import {
  ThemeType,
  textColorMap,
  faviconMap,
  simpleTitleMap,
  siteThemeColorMap,
} from "../interfaces/themeMaps";
import { useUser } from "./contexts/UserContext";
import {
  fetchCheckIfUserExistsBySecureSub,
  fetchUploadUserToServer,
  fetchUserDataBySecureSub,
  getSessionToken,
  modifySessionToken,
} from "@/lib/accountManager";
import { useEffect } from "react";
import { useSettings } from "./contexts/SettingsContext";

interface LayoutProps {
  theme: ThemeType;
  children: React.ReactNode;
  className?: string;
}

const MainPageLayout: React.FC<LayoutProps> = ({
  theme,
  children,
  className,
}) => {
  const { user, setUser } = useUser();
  const { updateSettingsLocally } = useSettings();

  useEffect(() => {
    async function restoreUserInfo() {
      if (user !== null) return;

      try {
        const token = await getSessionToken();
        if (token === null) return;

        setUser(token);
        if (!fetchCheckIfUserExistsBySecureSub) return;
        const downloadedUser = await fetchUserDataBySecureSub(token.secureSub, [
          "name",
          "profilePic",
          "state",
          "websiteSettings",
        ]);

        const savedRawSettings = localStorage.getItem("websiteSettings");
        const loadedSettings = savedRawSettings
          ? JSON.parse(savedRawSettings)
          : {
              backgroundRichness: "rich",
              syncSettings: true,
              navigationBar: "flexible",
              disableCenterPainting: false,
              disableComments: false,
              disableGestures: false,
              disableSerifFont: false,
            };
        const doSyncSettings: boolean = loadedSettings.syncSettings;

        let localSettings = doSyncSettings
          ? downloadedUser.websiteSettings
          : null;

        if (doSyncSettings) {
          if (downloadedUser.websiteSettings === null) {
            localSettings = loadedSettings;
            await fetchUploadUserToServer(
              { ...downloadedUser, websiteSettings: localSettings },
              token.secureSub
            );
          } else {
            localSettings = downloadedUser.websiteSettings;
            updateSettingsLocally(localSettings);
          }
        }

        const newUser = { ...downloadedUser, websiteSettings: localSettings, secureSub: token.secureSub };
        setUser(newUser);
        modifySessionToken(newUser);
      } catch (error) {
        console.error("Error in restoring user session:", error);
      }
    }

    restoreUserInfo();
  }, [user, setUser]);

  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
  const simpleTitle = simpleTitleMap[theme] || simpleTitleMap["zimo"];
  const siteThemeColor = siteThemeColorMap[theme] || siteThemeColorMap["zimo"];

  return (
    <main>
      <Head>
        <link rel="icon" type="image/x-icon" href={faviconSrc} />
        <title>{simpleTitle}</title>
        <meta property="og:site_name" content="Zimo" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={siteThemeColor} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="author" content="Zimo" />
      </Head>
      <BackgroundImage theme={theme} />
      <BackgroundAnimation theme={theme} />
      <Navbar theme={theme} />
      <div className={`font-arial ${textColorClass} ${className}`}>
        {children}
      </div>
      <Footer theme={theme} />
    </main>
  );
};

export default MainPageLayout;
