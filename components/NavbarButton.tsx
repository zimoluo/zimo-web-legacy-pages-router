import React from 'react';
import Link from 'next/link';
import { iconTextMap, topIconMap, ThemeType, svgFilterMap, textColorMap } from '../interfaces/themeMaps';
import Image from 'next/image';

type NavbarButtonProps = {
  item: 'photos' | 'blog' | 'projects' | 'about';
  theme: ThemeType
};

const NavbarButton: React.FC<NavbarButtonProps> = ({ item, theme }) => {

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const shouldApplyGlow = item === theme ? 'shadow-favicon-glow' : '';

  return (
    <Link href={`/${item}`} passHref>
      <div className="group font-arial bg-transparent px-6 py-1 rounded relative min-w-fit font-bold h-6 cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100">
          <Image src={topIconMap[item]} className={`h-6 mr-2 transform rounded transition-all duration-300 group-hover:scale-125 ${svgFilterClass} ${shouldApplyGlow}`} alt={`${iconTextMap[item]} Icon`} width={24} height={24} priority={true} />
          <div className={`text-xl items-center hidden md:block ${textColorClass}`}>
            {iconTextMap[item]}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NavbarButton;
