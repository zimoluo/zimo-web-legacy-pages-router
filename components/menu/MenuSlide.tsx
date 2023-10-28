import { useEffect, useRef } from "react";
import {
  ThemeType,
  lightBgColorMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import MenuContent from "./MenuContent";
import { useSettings } from "../contexts/SettingsContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
};

const MenuSlide: React.FC<Props> = ({ isOpen, onClose, theme }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const menuBgClass = lightBgColorMap[theme] || lightBgColorMap["zimo"];

  const { settings } = useSettings();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Function to update body overflow based on media query and isOpen
    const updateBodyOverflow = () => {
      if (mediaQuery.matches && isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    // Initially set body overflow based on initial conditions
    updateBodyOverflow();

    // Listen for changes in the media query
    mediaQuery.addEventListener("change", updateBodyOverflow);

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
      mediaQuery.removeEventListener("change", updateBodyOverflow);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Explicitly check for null
      const target = event.target as Node;

      // Check for the special button by its id
      if (
        target &&
        target instanceof HTMLElement &&
        target.id === "menu-button"
      ) {
        return;
      }

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target) && isOpen) {
        onClose();
      }
    };

    // Attach the event listeners
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: remove the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <aside
      aria-hidden={!isOpen}
      ref={menuRef}
      className={`fixed top-0 right-0 z-40 h-screen w-screen w-menu-slide-desktop ${menuBgClass} ${
        theme === "about" && settings.disableBackgroundBlur
          ? "bg-color-about-opaque"
          : ""
      } ${
        settings.disableBackgroundBlur ? "bg-opacity-100" : "bg-opacity-60"
      } ${textColorClass} rounded-l-xl md:shadow-lg ${
        !settings.disableBackgroundBlur ? "md:backdrop-blur-xl" : ""
      } transition-all duration-300 md:duration-200 ease-out transform ${
        isOpen
          ? `${
              !settings.disableBackgroundBlur ? "backdrop-blur-xl" : ""
            } translate-y-0 md:translate-x-0`
          : "-translate-y-full md:translate-y-0 md:translate-x-full"
      } z-10`}
    >
      <MenuContent theme={theme} />
    </aside>
  );
};

export default MenuSlide;
