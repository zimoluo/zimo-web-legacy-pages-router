import Image from 'next/image';

const ZimoBackgroundAnimation = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-1 pointer-events-none">
        <Image 
          src="/zimo-bg-light-moving-1.svg" 
          layout="fill" 
          className="object-cover" 
          alt="Background moving image 1"
        />
      </div>

      <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-3 pointer-events-none">
        <Image 
          src="/zimo-bg-light-moving-3.svg" 
          layout="fill" 
          className="object-cover" 
          alt="Background moving image 3"
        />
      </div>

      <div className="absolute inset-0 -z-10 top-4 hidden md:block pointer-events-none">
        <Image 
          src="/zimo-text-light.svg" 
          layout="fill" 
          className="object-cover" 
          alt="Background text light for desktop"
        />
      </div>

      <div className="absolute inset-0 -z-10 top-4 md:hidden pointer-events-none">
        <Image 
          src="/zimo-text-light-mobile.svg" 
          layout="fill" 
          className="object-cover" 
          alt="Background text light for mobile"
        />
      </div>

      <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-2 pointer-events-none">
        <Image 
          src="/zimo-bg-light-moving-2.svg" 
          layout="fill" 
          className="object-cover" 
          alt="Background moving image 2"
        />
      </div>
    </>
  );
};

export default ZimoBackgroundAnimation;
