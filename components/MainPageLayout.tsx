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
import { useUser } from "./Contexts/UserContext";
import {
  fetchCheckIfUserExistsBySecureSub,
  fetchUserDataBySecureSub,
  getSessionToken,
} from "@/lib/accountManager";
import { useEffect } from "react";

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

  useEffect(() => {
    async function restoreUserInfo() {
      if (user !== null) return;

      try {
        const token = await getSessionToken();
        if (token === null) return;

        setUser(token);
      } catch (error) {
        console.error("Error in restoreUserInfo:", error);
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
        <link rel="preload" as="image" href="/favicon.svg" />
        <link rel="preload" as="image" href="/zimo-favicon.svg" />
        <link rel="preload" as="image" href="/photos-zimo.svg" />
        <link rel="preload" as="image" href="/blog-zimo.svg" />
        <link rel="preload" as="image" href="/projects-zimo.svg" />
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
