import Image from "next/image";

const PhotosBackgroundAnimation: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 animate-move-glass-group-1">
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 animate-move-glass-individual-1"
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 animate-move-glass-individual-2"
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 animate-move-glass-individual-3"
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 animate-move-glass-individual-4"
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 animate-move-glass-individual-5"
        />
      </div>

      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 right-1/2 bottom-1/3 animate-move-glass-group-2">
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 animate-move-glass-individual-6 hidden md:block"
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 animate-move-glass-individual-7 hidden md:block"
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"

          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 animate-move-glass-individual-8 hidden md:block"
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 animate-move-glass-individual-9 hidden md:block"
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 animate-move-glass-individual-10 hidden md:block"
        />
      </div>

      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 left-1/2 top-1/3 animate-move-glass-group-3">
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 animate-move-glass-individual-1 hidden md:block"
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 animate-move-glass-individual-2 hidden md:block"
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 animate-move-glass-individual-3 hidden md:block"
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 animate-move-glass-individual-4 hidden md:block"
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          className="absolute pointer-events-none h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 animate-move-glass-individual-5 hidden md:block"
        />
      </div>
    </>
  );
};

export default PhotosBackgroundAnimation;
