import Image from 'next/image';
import { backgroundImageMap, ThemeType, backgroundClassMap } from '../interfaces/themeMaps';

type BackgroundImageProps = {
  theme: ThemeType;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ theme }) => {
  
    const backgroundImageSrc = backgroundImageMap[theme] || backgroundImageMap["zimo"];
    const backgroundClassSrc = backgroundClassMap[theme] || backgroundClassMap["zimo"];

  return (
    <div className={`fixed -z-50 pointer-events-none inset-0 flex items-center justify-center h-screen isolate bg-cover bg-center bg-fixed`}>
      <Image
        src={backgroundImageSrc}
        className='w-full h-full object-cover'
        layout="fill"
        alt="Background image"
      />
    </div>
  );
};

export default BackgroundImage;
