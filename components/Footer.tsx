import Link from 'next/link';
import { faviconMap, barColorMap, textColorMap, borderColorMap, ThemeType } from './themeMaps';

type FooterProps = {
  theme: ThemeType;
};

const Footer: React.FC<FooterProps> = ({ theme }) => {

  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const borderColorClass = borderColorMap[theme] || borderColorMap["zimo"];

  return (
    <div className={`${textColorClass} p-6 ${barColorClass} z-20 w-full font-arial`}>
      <div className="flex items-center mb-4 text-xl font-bold">
        <img src={faviconSrc} alt="Dynamic logo" className="h-8 mr-3" />
        <div>Zimo</div>
      </div>
      <div className={`border-t ${borderColorClass} my-4`}></div>
      <div className="flex justify-around mb-4">
        <Link href="/" passHref><div className="hover:underline cursor-pointer">Home</div></Link>
        <Link href="/photos" passHref><div className="hover:underline cursor-pointer">Album</div></Link>
        <Link href="/blog" passHref><div className="hover:underline cursor-pointer">Blog</div></Link>
        <Link href="/projects" passHref><div className="hover:underline cursor-pointer">Projects</div></Link>
        <Link href="/about" passHref><div className="hover:underline cursor-pointer">About</div></Link>
      </div>
      <div className="text-center text-sm">
        &copy; 2023 Zimo Luo. All Rights Reserved.
      </div>
    </div>
  );
};



export default Footer;
