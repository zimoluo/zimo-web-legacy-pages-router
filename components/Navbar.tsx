import NavbarButton from './NavbarButton';
import React, { useEffect, useState } from 'react';
import { barColorMap, textColorMap, ThemeType, faviconMap, svgFilterMap } from './themeMaps';
import Image from 'next/image';
import Link from 'next/link';

type NavbarProps = {
  theme: ThemeType;
};

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const barColor = scrollY > 25 ? barColorClass : 'bg-opacity-0';

  return (
    <div id="navbar" className={`${textColorClass} ${barColor} bg-opacity-0 px-4 h-12 transition-all duration-600 fixed w-full top-0 opacity-100 flex items-center justify-between z-20 backdrop-blur-lg`}>
      <div className="flex-none">
        <Link href={`/`} passHref>
        <Image src={`${faviconSrc}`} className="h-6 w-auto transform transition-all duration-300 hover:scale-125 cursor-pointer" alt="Website Icon" width="0" height="0"/>
        </Link>
      </div>
      <div className="flex flex-grow"></div>
      <div className={`flex flex-grow-navbar space-x-3 justify-between font-arial`}>
      {['photos', 'blog', 'projects', 'about'].map((item) => (
        <NavbarButton key={item} item={item as 'photos' | 'blog' | 'projects' | 'about'} theme={theme} />
      ))}
    </div>
      <div className="flex flex-grow"></div>
      <div className="flex-none">
        <Image src="/mode-light.svg" className={`h-6 w-auto transform transition-all duration-300 hover:scale-125 ${svgFilterClass}`} alt="Light Dark Mode Switch" width="0" height="0" />
      </div>
    </div>
  );
};

export default Navbar;
