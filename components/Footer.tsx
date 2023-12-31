import Link from "next/link";
import {
  faviconMap,
  barColorMap,
  textColorMap,
  borderColorMap,
  ThemeType,
  lightBgColorMap,
} from "../interfaces/themeMaps";
import Image from "next/image";
import { useSettings } from "./contexts/SettingsContext";

type FooterProps = {
  theme: ThemeType;
};

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const lightBgClass = lightBgColorMap[theme] || lightBgColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const borderColorClass = borderColorMap[theme] || borderColorMap["zimo"];

  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();
  const displayYear = currentYear > 2023 ? `2023-${currentYear}` : "2023";

  return (
    <footer
      className={`${textColorClass} p-6 ${
        !settings.disableBackgroundBlur
          ? barColorClass
          : `${lightBgClass} bg-opacity-80`
      } z-20 w-full font-arial ${
        !settings.disableBackgroundBlur ? "backdrop-blur-md" : ""
      }`}
    >
      <div className="flex items-center mb-4 text-xl font-bold">
        <Image
          src={faviconSrc}
          alt="Website favicon"
          className="h-8 mr-3"
          height={32}
          width={32}
        />
        <div>Zimo Web</div>
      </div>
      <div className={`border-t ${borderColorClass} my-4`}></div>
      <div className="grid grid-footer gap-y-2 gap-x-1 justify-center underline-offset-2 text-center mb-4">
        <Link href="/">
          <div className="hover:underline cursor-pointer">Home</div>
        </Link>
        <Link href="/photos">
          <div className="hover:underline">Album</div>
        </Link>
        <Link href="/blog">
          <div className="hover:underline">Blog</div>
        </Link>
        <Link href="/projects">
          <div className="hover:underline">Projects</div>
        </Link>
        <Link href="/about">
          <div className="hover:underline">About</div>
        </Link>
        <Link href="/management">
          <div className="hover:underline">Management</div>
        </Link>
      </div>
      <div className="text-center text-sm" suppressHydrationWarning={true}>
        &copy; {displayYear} Zimo Luo. All Rights Reserved.{" "}
        <Link
          href="/management/terms-of-use"
          className="hover:underline underline-offset-2"
        >
          Terms&nbsp;of&nbsp;Use
        </Link>
        {" and "}
        <Link
          href="/management/privacy-policy"
          className="hover:underline underline-offset-2"
        >
          Privacy&nbsp;Policy
        </Link>
        {" apply."} Share feedback{" "}
        <a
          href="https://forms.gle/hiowUpHKcd5qpx6v8"
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          here
        </a>
        .
      </div>
    </footer>
  );
};

export default Footer;
