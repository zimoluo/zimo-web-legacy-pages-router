import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeType } from "@/interfaces/themeMaps";

interface Props {
  theme?: ThemeType;
  visible: boolean;
  resetCounter?: () => void;
}

const SpinningFavicon = ({
  theme = "zimo",
  visible,
  resetCounter = () => {},
}: Props) => {
  const [animationStage, setAnimationStage] = useState(1);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setAnimationStage(2), 0);

      setTimeout(() => setAnimationStage(3), 400);

      setTimeout(() => setAnimationStage(4), 1400);

      setTimeout(() => {
        setAnimationStage(0);
        resetCounter();
      }, 1700);
    }
  }, [visible]);

  if (animationStage === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex justify-center rotate-0 items-center z-100 select-none pointer-events-none transition-all duration-300 ease-in-out ${
        animationStage === 1 || animationStage === 4 || animationStage === 0
          ? "opacity-0"
          : "opacity-100"
      }`}
      style={
        animationStage === 3
          ? { animation: "chargeSpin 900ms ease-in-out" }
          : {}
      }
    >
      <Image
        src={theme === "zimo" ? "/zimo-favicon.svg" : "/favicon.svg"}
        alt="Spinning Favicon"
        height={100}
        width={100}
        className="pointer-events-none spinning-favicon-size absolute select-none"
        placeholder="empty"
        priority={true}
      />
    </div>
  );
};

export default SpinningFavicon;
