import Image from 'next/image';

const AboutBackgroundAnimation: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-30 flex items-center justify-center pointer-events-none select-none">
        <Image
          src="/about-pane-burst-1.svg"
          alt="Background Burst 1"
          height="0"
          width="0"
          layout="fixed"
          className="object-cover w-full h-full animate-zimo-scale-1"
          placeholder='empty'
          priority={true}
        />
      </div>

      <div className="fixed inset-0 -z-30 flex items-center justify-center pointer-events-none select-none">
        <Image
          src="/about-pane-burst-2.svg"
          alt="Background Burst 2"
          height="0"
          width="0"
          layout="fixed"
          className="object-cover w-full h-full animate-zimo-scale-2"
          placeholder='empty'
          priority={true}
        />
      </div>

      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/3 -z-20 pointer-events-none select-none">
        <Image
          src="/zimo-profile.svg"
          alt="Zimo Profile"
          height="0"
          width="0"
          layout="fixed"
          className="object-cover zimo-profile-size"
          placeholder='empty'
          priority={true}
        />
      </div>

      <div className="absolute left-0 top-1/2 transform -translate-y-2/3 -z-20 pointer-events-none select-none">
        <Image
          src="/zimo-vertical.svg"
          alt="Zimo Vertical"
          height="0"
          width="0"
          layout="fixed"
          className="object-cover zimo-vertical-size opacity-40"
          placeholder='empty'
          priority={true}
        />
      </div>
    </>
  );
};

export default AboutBackgroundAnimation;
