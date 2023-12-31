import Image from "next/image";
import { useSettings } from "../contexts/SettingsContext";
import { useRouter } from "next/router";

const ZimoBackgroundAnimation = () => {
  const { settings } = useSettings();
  const router = useRouter();

  return (
    <>
      {settings.backgroundRichness === "rich" && (
        <>
          <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-1 pointer-events-none select-none">
            <Image
              src="/zimo-bg-light-moving-1.svg"
              height="0"
              width="0"
              className="object-cover w-full h-full"
              alt="Background moving image 1"
              placeholder="empty"
              priority={true}
            />
          </div>

          <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-3 pointer-events-none select-none">
            <Image
              src="/zimo-bg-light-moving-3.svg"
              height="0"
              width="0"
              className="object-cover w-full h-full"
              alt="Background moving image 3"
              placeholder="empty"
              priority={true}
            />
          </div>
        </>
      )}

      {router.pathname === "/" && (
        <>
          <div className="absolute inset-0 -z-10 top-4 hidden md:block pointer-events-none select-none">
            <Image
              src="/zimo-text-light.svg"
              height="0"
              width="0"
              className="object-cover w-full h-auto"
              alt="Background text light for desktop"
              placeholder="empty"
              priority={true}
            />
          </div>

          <div className="absolute inset-0 -z-10 top-4 md:hidden pointer-events-none select-none">
            <Image
              src="/zimo-text-light-mobile.svg"
              height="0"
              width="0"
              className="object-cover w-full h-auto"
              alt="Background text light for mobile"
              placeholder="empty"
              priority={true}
            />
          </div>
        </>
      )}

      {settings.backgroundRichness === "rich" && (
        <div className="fixed inset-0 -z-10 flex items-center justify-center animate-move-bg-2 pointer-events-none select-none">
          <Image
            src="/zimo-bg-light-moving-2.svg"
            height="0"
            width="0"
            className="object-cover w-full h-full"
            alt="Background moving image 2"
            placeholder="empty"
            priority={true}
          />
        </div>
      )}
    </>
  );
};

export default ZimoBackgroundAnimation;
