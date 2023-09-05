import Image from "next/image";
import { useEffect, useState } from "react";

const PhotosBackgroundAnimationWebkit: React.FC = () => {
  const [enableAnimation, setEnableAnimation] = useState(false);

  useEffect(() => {
    // Enable animation after a short delay
    const timer = setTimeout(() => {
      setEnableAnimation(true);
    }, 30000);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-30 flex items-center justify-center h-screen pointer-events-none opacity-20">
        <Image
          src="/photos-new-bg-zimo.svg"
          alt="Zimo Text"
          height={2000}
          width={1200}
          className="object-cover w-full h-full"
          placeholder="empty"
          priority={true}
        />
      </div>
      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 animate-move-glass-group-1">
        <div
          className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-1" : ""
          } rounded-glass-pane color-glass-pane-base shadow-lg`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-2" : ""
          }`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-3" : ""
          }`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-4" : ""
          }`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-5" : ""
          }`}
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-1" : ""
          }`}
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-2" : ""
          }`}
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-3" : ""
          }`}
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-4" : ""
          }`}
        />
        <Image
          src="/photos-stained-circle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-5" : ""
          }`}
        />
      </div>

      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 right-1/2 bottom-1/3 animate-move-glass-group-2">
        <div
          className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-6" : ""
          } rounded-glass-pane color-glass-pane-base shadow-lg hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-7" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-8" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-9" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-10" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-6" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-7" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-8" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-9" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-glass-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-10" : ""
          } hidden md:block`}
        />
      </div>

      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 left-1/2 top-1/3 animate-move-glass-group-3">
        <div
          className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-1" : ""
          } rounded-glass-pane color-glass-pane-base shadow-lg hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-2" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-3" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-4" : ""
          } hidden md:block`}
        />
        <div
          className={`-z-20 rounded-glass-pane color-glass-pane-base shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-5" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-2 translate-x-0 translate-y-0 ${
            enableAnimation ? "animate-move-glass-individual-1" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-1 -translate-x-1/6 translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-2" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-3" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-3 translate-x-1/6 -translate-y-1/6 ${
            enableAnimation ? "animate-move-glass-individual-4" : ""
          } hidden md:block`}
        />
        <Image
          src="/photos-stained-squircle-light.svg"
          height="0"
          width="0"
          alt="Stained Glass Pane"
          placeholder="empty"
          priority={true}
          className={`absolute pointer-events-none photos-glass-pane h-44 w-auto opacity-20 photos-glass-4 translate-x-1/3 -translate-y-1/3 ${
            enableAnimation ? "animate-move-glass-individual-5" : ""
          } hidden md:block`}
        />
      </div>
    </>
  );
};

export default PhotosBackgroundAnimationWebkit;
