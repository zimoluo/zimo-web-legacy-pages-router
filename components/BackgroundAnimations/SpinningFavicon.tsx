import Image from "next/image";
import { useSettings } from "../contexts/SettingsContext";
import { ThemeType } from "@/interfaces/themeMaps";

interface Props {
  theme?: ThemeType;
  visible: boolean;
}

const SpinningFavicon = ({ theme = "zimo", visible }: Props) => {
  const { settings } = useSettings();

  return (
    settings.backgroundRichness === "rich" && (
      <div
        className={`fixed inset-0 flex justify-center items-center pointer-events-none -z-7 select-none opacity-0 transition-opacity duration-300 ease-in-out ${
          visible ? "opacity-100" : ""
        }`}
      >
        <Image
          src={theme === "zimo" ? "/zimo-favicon.svg" : "/favicon.svg"}
          alt="Spinning Favicon"
          height="0"
          width="0"
          className="absolute pointer-events-none rotate-0 spinning-favicon-size animate-spin-favicon"
          placeholder="empty"
          priority={true}
        />
      </div>
    )
  );
};

export default SpinningFavicon;
