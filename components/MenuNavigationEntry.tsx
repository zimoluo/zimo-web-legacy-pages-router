import React from "react";
import Link from "next/link";
import {
  iconTextMap,
  ThemeType,
  svgFilterMap,
  textColorMap,
  faviconMap,
  menuEntryBorderMap,
} from "../interfaces/themeMaps";
import Image from "next/image";

type Props = {
  item: "home" | "photos" | "blog" | "projects" | "about";
  theme: ThemeType;
};

const MenuNavigationEntry: React.FC<Props> = ({ item, theme }) => {
  const navIconMap: { [key: string]: string } = {
    home: faviconMap[theme],
    photos: "/photos-light.svg",
    blog: "/blog-light.svg",
    projects: "/projects-light.svg",
    about: "/about-light.svg",
  };

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const borderColorClass = menuEntryBorderMap[theme];

  return (
    <>
      <Link href={`/${item === "home" ? "" : item}`} passHref>
        <div className="group font-arial cursor-pointer flex items-center my-4">
          <Image
            src={navIconMap[item]}
            className={`h-8 md:h-10 w-auto aspect-square transform transition-transform duration-300 group-hover:scale-110 md:group-hover:scale-125 ${
              item === "home" ? "" : svgFilterClass
            } `}
            alt={`${iconTextMap[item]} Icon`}
            width={40}
            height={40}
          />
          <div className="flex-grow" />
          <div className={`ml-3 ${textColorClass}`}>
            {iconTextMap[item]}
          </div>
        </div>
      </Link>
      {item !== "about" && (
        <div
          className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
        ></div>
      )}
    </>
  );
};

export default MenuNavigationEntry;
