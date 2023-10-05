import NavbarButton from "./NavbarButton";
import React, { useEffect, useState } from "react";
import {
  barColorMap,
  textColorMap,
  ThemeType,
  faviconMap,
  svgFilterMap,
  sliderButtonColorMap,
} from "../interfaces/themeMaps";
import Image from "next/image";
import Link from "next/link";
import MenuSlide from "./menu/MenuSlide";
import { useSettings } from "./contexts/SettingsContext";

type NavbarProps = {
  theme: ThemeType;
};

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
  const alternativeBarColor =
    sliderButtonColorMap[theme] || sliderButtonColorMap["zimo"];

  const { settings } = useSettings();

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const scrollThreshold = 4;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuButtonRotation, setMenuButtonRotation] = useState(false);
  const [menuButtonTranslation, setMenuButtonTranslation] = useState(false);

  const openMenu = () => {
    setNavbarVisible(true);
    setMenuOpen(true);

    setMenuButtonTranslation(true);
    setTimeout(() => {
      setMenuButtonRotation(true);
    }, 80);
  };

  const restoreNavbar = () => {
    setNavbarVisible(true);
    setMenuOpen(false);

    setMenuButtonRotation(false);
    setTimeout(() => {
      setMenuButtonTranslation(false);
    }, 80);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const distanceScrolled = Math.abs(currentScrollY - lastScrollY);

      setScrollY(currentScrollY);

      if (currentScrollY < 40) {
        setNavbarVisible(true);
      } else {
        if (distanceScrolled >= scrollThreshold) {
          if (currentScrollY > lastScrollY) {
            // Scrolling down
            if (!menuOpen && settings.navigationBar === "flexible")
              setNavbarVisible(false);
          } else {
            // Scrolling up
            setNavbarVisible(true);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const barColor =
    scrollY > 25
      ? `${
          !settings.disableBackgroundBlur
            ? barColorClass
            : `${alternativeBarColor} bg-opacity-80`
        } ${!settings.disableBackgroundBlur ? "backdrop-blur-md" : ""}`
      : "bg-opacity-0";
  const navbarClass = `${textColorClass} ${barColor} ${
    menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
  } px-4 h-12 transition-all duration-300 ease-out fixed w-full top-0 flex items-center justify-between z-20`;

  return (
    <>
      {settings.navigationBar !== "disabled" && (
        <nav
          id="navbar"
          className={
            navbarVisible ? navbarClass : `${navbarClass} -translate-y-14`
          }
        >
          <div className="flex-none">
            <Link href={`/`} passHref>
              <Image
                src={`${faviconSrc}`}
                className="h-6 w-auto transform transition-all duration-300 hover:scale-125 cursor-pointer"
                alt="Home Icon"
                width={24}
                height={24}
                priority={true}
              />
            </Link>
          </div>
          <div className="flex flex-grow"></div>
          <div
            className={`flex flex-grow-navbar space-x-0 justify-between font-arial`}
          >
            {["photos", "blog", "projects", "about"].map((item) => (
              <NavbarButton
                key={item}
                item={item as "photos" | "blog" | "projects" | "about"}
                theme={theme}
              />
            ))}
          </div>
          <div className="flex flex-grow"></div>
          <div className="flex-none h-6 w-auto aspect-square" />
        </nav>
      )}

      <MenuSlide isOpen={menuOpen} onClose={restoreNavbar} theme={theme} />
      <button
        className={`fixed top-3 right-4 flex-none h-6 w-auto aspect-square hover:scale-125 transform transition-transform duration-300 z-40 ease-out ${
          navbarVisible || menuOpen ? "" : `-translate-y-14`
        } `}
        onClick={menuOpen ? restoreNavbar : openMenu}
        id="menu-button"
      >
        <Image
          src="/more-icon-animated.svg"
          className={`absolute h-6 w-auto ${
            menuButtonTranslation ? "-translate-y-1/2" : "-translate-y-1/3"
          } ${
            menuButtonRotation ? "-rotate-45" : ""
          } pointer-events-none aspect-square transform transition-all duration-150 ${svgFilterClass}`}
          alt="More Settings Lower"
          width={24}
          height={24}
          priority={true}
        />
        <Image
          src="/more-icon-animated.svg"
          className={`absolute h-6 w-auto ${
            menuButtonTranslation ? "-translate-y-1/2" : "-translate-y-2/3"
          } ${
            menuButtonRotation ? "rotate-45" : ""
          } pointer-events-none aspect-square transform transition-all duration-150 ${svgFilterClass}`}
          alt="More Settings Upper"
          width={24}
          height={24}
          priority={true}
        />
      </button>
    </>
  );
};

export default Navbar;
