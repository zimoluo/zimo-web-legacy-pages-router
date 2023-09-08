import React, { useEffect } from "react";
import Image from "next/image";
import { ThemeType, barColorMap, svgFilterMap } from "../interfaces/themeMaps";
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

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-screen w-menu-slide-desktop ${barColorClass} rounded-l-xl shadow-lg backdrop-blur-xl transition-all ease-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-10`}
    >
      <button
        onClick={onClose}
        className={`absolute top-3 right-4 ${svgFilterClass}`}
      >
        <Image src="/close-menu-slide.svg" className="h-6 w-auto transform transition-all duration-300 hover:scale-125" alt="Close" width={24} height={24} priority={true} />
      </button>
      <MenuContent />
    </div>
  );
};

export default MenuSlide;
