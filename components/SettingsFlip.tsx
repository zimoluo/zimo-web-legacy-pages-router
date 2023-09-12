import {
  ThemeType,
  flipFilterMap,
  menuEntryBorderMap,
} from "@/interfaces/themeMaps";
import Image from "next/image";

interface Props {
  theme: ThemeType;
  onClick: (status: boolean) => void;
  state: boolean;
}

const SettingsFlip: React.FC<Props> = ({ theme, onClick, state = false }) => {
  function flip() {
    onClick(!state);
  }

  const flipFilterClass = flipFilterMap[theme] || flipFilterMap["zimo"];

  return (
    <button
      className="h-8 md:h-10 w-auto relative rounded-full overflow-hidden shadow-lg select-none"
      onClick={flip}
    >
      <Image
        src="/settings-flip-base.svg"
        className={`h-8 md:h-10 w-auto object-fill rounded-full select-none pointer-events-none`}
        height={40}
        width={71}
        alt="Flip base"
      />
      <Image
        src="/settings-flip-on.svg"
        className={`h-8 md:h-10 w-auto object-fill rounded-full absolute top-0 left-0 pointer-events-none select-none ${flipFilterClass} backdrop-blur-sm transition-opacity duration-200 ease-out ${
          state ? "opacity-50" : "opacity-0"
        } `}
        height={40}
        width={71}
        alt="Flip base"
      />
      <Image
        src="/settings-flip-button.svg"
        className={`h-8 md:h-10 w-auto aspect-square rounded-full absolute top-0 left-0 pointer-events-none select-none transform transition-transform duration-200 ease-out ${
          state ? "translate-x-flip-mobile translate-x-flip" : "translate-x-0"
        } rounded-full`}
        height={40}
        width={71}
        alt="Flip button"
      />
    </button>
  );
};

export default SettingsFlip;
