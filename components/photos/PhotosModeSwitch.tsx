import { useSettings } from "../contexts/SettingsContext";
import Image from "next/image";

const PhotosModeSwitch = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <section className="inline-flex items-center rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-orange-50 bg-opacity-60 backdrop-blur-lg relative overflow-hidden border-menu-entry border-orange-300">
      <div
        className={`absolute top-1/2 -translate-y-1/2 bg-orange-800 w-12 md:w-16 rounded-full h-auto aspect-square transition-transform duration-300 ${
          settings.enableGallery
            ? "translate-x-6.5 md:translate-x-9"
            : "-translate-x-4 md:-translate-x-5"
        }`}
      />
      <button
        className="mr-3 md:mr-4 relative group"
        onClick={() => {
          if (settings.enableGallery) {
            updateSettings({ enableGallery: false });
          }
        }}
      >
        <Image
          src="/entry-photos-off.svg"
          className="w-6 md:w-8 h-auto aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110"
          alt="Entry Mode"
          width={32}
          height={32}
        />
        <Image
          src="/entry-photos-on.svg"
          className={`w-6 md:w-8 h-auto aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-110 ${
            settings.enableGallery ? "opacity-100" : "opacity-0"
          }`}
          alt="Entry Mode"
          width={32}
          height={32}
          aria-hidden="true"
        />
      </button>
      <button
        className="relative group"
        onClick={() => {
          if (!settings.enableGallery) {
            updateSettings({ enableGallery: true });
          }
        }}
      >
        <Image
          src="/gallery-on.svg"
          className="w-6 md:w-8 h-auto aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110"
          alt="Gallery Mode"
          width={32}
          height={32}
        />
        <Image
          src="/gallery-off.svg"
          className={`w-6 md:w-8 h-auto aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-110 ${
            settings.enableGallery ? "opacity-100" : "opacity-0"
          }`}
          alt="Gallery Mode"
          width={32}
          height={32}
          aria-hidden="true"
        />
      </button>
    </section>
  );
};

export default PhotosModeSwitch;
