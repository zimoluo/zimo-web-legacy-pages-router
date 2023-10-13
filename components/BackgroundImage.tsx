import Image from "next/image";
import {
  backgroundImageMap,
  ThemeType,
  blurColorMap,
} from "../interfaces/themeMaps";
import { useSettings } from "./contexts/SettingsContext";

type BackgroundImageProps = {
  theme: ThemeType;
};

const BackgroundImage: React.FC<BackgroundImageProps> = ({ theme }) => {
  const { settings } = useSettings();
  let backgroundImageSrc =
    backgroundImageMap[theme] || backgroundImageMap["zimo"];

  if (theme === "about") {
    backgroundImageSrc =
      settings.backgroundRichness === "minimal"
        ? "/about-pane-opaque.svg"
        : backgroundImageSrc;
  }

  const blurSrc = blurColorMap[theme] || blurColorMap["zimo"];

  return (
    <div
      className={`fixed -z-50 pointer-events-none inset-0 flex items-center justify-center h-screen isolate bg-cover bg-center bg-fixed select-none`}
    >
      <Image
        src={backgroundImageSrc}
        className="w-full h-full object-cover"
        height={2000}
        width={1200}
        alt="Background image"
        placeholder="blur"
        priority={true}
        blurDataURL={blurSrc}
        aria-hidden="true"
      />
    </div>
  );
};

export default BackgroundImage;
