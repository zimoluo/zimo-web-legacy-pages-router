import Image from "next/image";
import KawarageAnimation from "./KawarageAnimation";

const ProjectsBackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 rotate-0 animate-spin-revolution">
      <div className="absolute pointer-events-none cog-size translate-cog-yang">
        <Image
          src="/projects-cog-yang.svg"
          alt="Cog Yang"
          height="0"
          width="0"
          layout="fixed"
          placeholder='empty'
          priority={true}
          className="pointer-events-none opacity-90 cog-size rotate-cog-yang animate-spin-cog -z-10"
        />
      </div>
      <div className="absolute pointer-events-none cog-size translate-cog-yin">
        <Image
          src="/projects-cog-yin.svg"
          alt="Cog Yin"
          height="0"
          width="0"
          layout="fixed"
          placeholder='empty'
          priority={true}
          className="pointer-events-none opacity-90 cog-size rotate-cog-yin animate-spin-cog-reverse -z-10"
        />
      </div>
      <KawarageAnimation/>
    </div>
  );
};

export default ProjectsBackgroundAnimation;