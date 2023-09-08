import React, { useEffect } from "react";
import { ThemeType, barColorMap } from "../interfaces/themeMaps";
import MenuContent from "./MenuContent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
};

const MenuSlide: React.FC<Props> = ({ isOpen, onClose, theme }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-screen w-menu-slide-desktop ${barColorClass} rounded-l-xl md:shadow-lg md:backdrop-blur-xl transition-all duration-200 ease-out transform ${
        isOpen ? "backdrop-blur-xl translate-y-0 md:translate-x-0" : "-translate-y-full md:translate-y-0 md:translate-x-full"
      } z-10`}
    >
      <MenuContent />
    </div>
  );
};

export default MenuSlide;
