import React from 'react';
import Link from 'next/link';
import { iconTextMap, topIconMap } from './themeMaps'; // Update the path accordingly

type NavbarButtonProps = {
  item: 'photos' | 'blog' | 'projects' | 'about';
};

const NavbarButton: React.FC<NavbarButtonProps> = ({ item }) => {
  return (
    <Link href={`/${item}`} passHref>
      <div className="group font-arial bg-transparent px-6 py-1 rounded relative min-w-fit font-bold h-6 cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100">
          <img src={`/${topIconMap[item]}`} className="h-6 mr-2 transform transition-all duration-300 group-hover:scale-125" alt={`${iconTextMap[item]} Icon`} />
          <div className="text-xl items-center hidden md:block text-black">
            {iconTextMap[item]}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NavbarButton;
