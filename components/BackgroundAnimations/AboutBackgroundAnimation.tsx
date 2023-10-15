import Image from "next/image";
import { useRouter } from "next/router";
import { useSettings } from "../contexts/SettingsContext";

const AboutBackgroundAnimation: React.FC = () => {
  const router = useRouter();
  const { settings } = useSettings();

  return (
    <>
      {settings.backgroundRichness === "rich" && (
        <>
          <div className="fixed inset-0 -z-30 flex items-center justify-center pointer-events-none select-none">
            <Image
              src="/about-pane-burst-1.svg"
              alt="Background Burst 1"
              height="0"
              width="0"
              className="object-cover w-full h-full animate-zimo-scale-1"
              placeholder="empty"
              priority={true}
            />
          </div>

          <div className="fixed inset-0 -z-30 flex items-center justify-center pointer-events-none select-none">
            <Image
              src="/about-pane-burst-2.svg"
              alt="Background Burst 2"
              height="0"
              width="0"
              className="object-cover w-full h-full animate-zimo-scale-2"
              placeholder="empty"
              priority={true}
            />
          </div>
        </>
      )}
      {router.pathname === "/about" && (
        <>
          <div className="absolute left-0 top-0 -z-20 pointer-events-none select-none hidden md:block">
            <Image
              src="/zimo-vertical.svg"
              alt="Zimo Vertical"
              height="0"
              width="0"
              className="object-cover zimo-vertical-size opacity-50"
              placeholder="empty"
              priority={true}
            />
          </div>
          <div className="absolute left-0 top-0 -z-20 pointer-events-none select-none md:hidden">
            <Image
              src="/zimo-vertical-mobile.svg"
              alt="Zimo Vertical"
              height="0"
              width="0"
              className="object-cover zimo-vertical-mobile-size opacity-40"
              placeholder="empty"
              priority={true}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AboutBackgroundAnimation;
