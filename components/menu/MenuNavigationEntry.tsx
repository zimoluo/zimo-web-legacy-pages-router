import React, { useState } from "react";
import Link from "next/link";
import {
  iconTextMap,
  ThemeType,
  svgFilterMap,
  textColorMap,
  faviconMap,
  menuEntryBorderMap,
} from "../../interfaces/themeMaps";
import Image from "next/image";
import { useRouter } from "next/router";

type NavigationItem =
  | "home"
  | "photos"
  | "blog"
  | "projects"
  | "about"
  | "management";

type Props = {
  item: NavigationItem;
  theme: ThemeType;
};

const MenuNavigationEntry: React.FC<Props> = ({ item, theme }) => {
  const navIconMap: { [key: string]: string } = {
    home: faviconMap[theme],
    photos: "/photos-light.svg",
    blog: "/blog-light.svg",
    projects: "/projects-light.svg",
    about: "/about-light.svg",
    management: "/management.svg",
  };

  const determineSite = (path: string): NavigationItem => {
    if (path.startsWith("/blog")) return "blog";
    if (path.startsWith("/projects")) return "projects";
    if (path.startsWith("/photos")) return "photos";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/management")) return "management";
    return "home";
  };

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const borderColorClass = menuEntryBorderMap[theme];

  const routerPathname = useRouter().pathname;

  const currentSite = determineSite(routerPathname);

  return (
    <>
      <Link href={`/${item === "home" ? "" : item}`} passHref>
        <div
          className={`group font-arial cursor-pointer flex items-center my-4 ${
            currentSite === item ? "font-bold" : ""
          }`}
        >
          <Image
            src={navIconMap[item]}
            className={`h-8 md:h-10 w-auto aspect-square transform transition-transform duration-300 group-hover:scale-110 ${
              item === "home" ? "" : svgFilterClass
            } `}
            alt={`${iconTextMap[item]} Icon`}
            width={40}
            height={40}
          />
          <div className="flex-grow" />
          <div className={`ml-3 ${textColorClass}`}>{iconTextMap[item]}</div>
        </div>
      </Link>
      {item !== "management" && (
        <div
          className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
        ></div>
      )}
    </>
  );
};

export default MenuNavigationEntry;
