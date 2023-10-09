import Link from "next/link";
import {
  faviconMap,
  barColorMap,
  textColorMap,
  borderColorMap,
  ThemeType,
} from "../interfaces/themeMaps";
import Image from "next/image";
import { useSettings } from "./contexts/SettingsContext";

type FooterProps = {
  theme: ThemeType;
};

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const borderColorClass = borderColorMap[theme] || borderColorMap["zimo"];

  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();
  const displayYear = currentYear > 2023 ? `2023-${currentYear}` : "2023";

  return (
    <footer
      className={`${textColorClass} p-6 ${barColorClass} z-20 w-full font-arial ${
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
      <div className="flex justify-around mb-4">
        <Link href="/" passHref>
          <div className="hover:underline cursor-pointer">Home</div>
        </Link>
        <Link href="/photos" passHref>
          <div className="hover:underline cursor-pointer">Album</div>
        </Link>
        <Link href="/blog" passHref>
          <div className="hover:underline cursor-pointer">Blog</div>
        </Link>
        <Link href="/projects" passHref>
          <div className="hover:underline cursor-pointer">Projects</div>
        </Link>
        <Link href="/about" passHref>
          <div className="hover:underline cursor-pointer">About</div>
        </Link>
      </div>
      <div className="text-center text-sm">
        &copy; {displayYear} Zimo Luo. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
