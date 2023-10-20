import { useState } from "react";
import { useSettings } from "./contexts/SettingsContext";
import Image from "next/image";

const ChangeManagementThemeButton: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function changeTheme() {
    if (isButtonDisabled) return;

    setIsSpinning(true);
    setIsButtonDisabled(true);

    setTimeout(
      () =>
        updateSettings({
          preferredManagementTheme:
            settings.preferredManagementTheme === "zimo" ? "about" : "zimo",
        }),
      300
    );

    setTimeout(() => {
      setIsSpinning(false);
      setIsButtonDisabled(false);
    }, 600);
  }

  return (
    <button
      className={`h-full w-auto aspect-square relative rotate-0 group ${
        isSpinning ? "animate-spin-theme-button" : ""
      }`}
      onClick={changeTheme}
      disabled={isButtonDisabled}
    >
      <Image
        src="/zimo-favicon.svg"
        alt="Change theme"
        className={`transition-transform duration-300 ease-in-out group-hover:scale-110`}
        height={32}
        width={32}
      />
      <Image
        src="/favicon.svg"
        className={`absolute top-0 right-0 transition-all duration-300 ease-in-out group-hover:scale-110 ${
          settings.preferredManagementTheme === "zimo"
            ? "opacity-0"
            : "opacity-100"
        }`}
        alt="Change theme"
        height={32}
        width={32}
      />
    </button>
  );
};

export default ChangeManagementThemeButton;
