import React from "react";
import Link from "next/link";
import {
  iconTextMap,
  topIconMap,
  ThemeType,
  svgFilterMap,
  textColorMap,
} from "../interfaces/themeMaps";
import Image from "next/image";

type NavbarButtonProps = {
  item: "photos" | "blog" | "projects" | "about";
  theme: ThemeType;
};

const NavbarButton: React.FC<NavbarButtonProps> = ({ item, theme }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const shouldApplyGlow = item === theme ? "shadow-favicon-glow" : "";

  return (
    <Link href={`/${item}`} passHref>
      <div className="group font-arial font-bold cursor-pointer flex items-center justify-center">
        <Image
          src={topIconMap[item]}
          className={`h-6 md:mr-2 rounded transition-transform duration-300 group-hover:scale-110 md:group-hover:scale-125 ${svgFilterClass} ${shouldApplyGlow}`}
          alt={`${iconTextMap[item]} Icon`}
          width={24}
          height={24}
          priority={true}
        />
        <div className={`text-xl hidden md:block ${textColorClass}`}>
          {iconTextMap[item]}
        </div>
      </div>
    </Link>
  );
};

export default NavbarButton;
