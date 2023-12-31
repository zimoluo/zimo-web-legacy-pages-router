import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import DarkOverlay from "../DarkOverlay";
import PhotosMainPopUp from "./PhotosMainPopUp";
import { rgbaDataURL } from "@/lib/util";
import { useSettings } from "../contexts/SettingsContext";

const PhotosTile = ({
  images,
  title,
  date,
  author,
  authorProfile,
  slug,
  location,
  instagramLink,
}: PhotosData) => {
  // A simple string hashing function
  const stringToSeed = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hash = (hash << 5) - hash + charCode;
      hash |= 0; // Convert to a 32bit integer
    }
    return hash;
  };

  // Xorshift algorithm.
  class Xorshift {
    private _state: number;

    constructor(seed: number = 1) {
      this._state = seed;
    }

    next(): number {
      this._state ^= this._state << 13;
      this._state ^= this._state >> 17;
      this._state ^= this._state << 5;
      return (this._state >>> 0) / Math.pow(2, 32); // Convert to [0, 1) range.
    }
  }

  const seed = useMemo(() => stringToSeed(images.url[0]), [images.url[0]]);
  const rng = useMemo(() => new Xorshift(seed), [seed]);
  const randomMultiplier = useMemo(() => 0.8 + rng.next() * 0.4, [rng]);

  const { settings } = useSettings();

  const [showPopup, setShowPopup] = useState(false);
  const [widthRatio, heightRatio] = images.aspectRatio.split(":").map(Number);
  const computedAspectRatio = useMemo(() => {
    // when widthRatio/heightRatio equals 1
    if (widthRatio / heightRatio === 1) {
      return 1;
    }
    // for all other cases, keep your existing logic
    return parseFloat(
      ((widthRatio / heightRatio) * randomMultiplier).toFixed(3)
    );
  }, [widthRatio, heightRatio, randomMultiplier]);

  const openPopUp = () => {
    setShowPopup(true);
    window.history.pushState({ popupOpen: true }, "", `#${slug}`);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Link href={`/photos/${slug}`}>
        <button
          className="w-42 md:w-72 h-auto rounded-xl overflow-hidden relative group"
          style={{ aspectRatio: `${computedAspectRatio}` }}
          onClick={(e) => {
            if (window.innerWidth >= 768 && !settings.disableEntryPopUp) {
              e.preventDefault();
              openPopUp();
            }
          }}
        >
          <Image
            className="object-center w-full h-full object-cover"
            src={images.url[0]}
            alt={`Cover of ${title}`}
            width={288}
            height={288 / computedAspectRatio}
            placeholder="blur"
            blurDataURL={rgbaDataURL(255, 237, 213, 0.85)}
          />
          <div
            className={`absolute inset-0 bg-black bg-opacity-60 select-none transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-90 `}
          />
          <div className="flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-90">
            <div className="sr-only opacity-0 pointer-events-none select-none">
              {title}
            </div>
            <Image
              className="aspect-square w-5 md:w-7 h-auto mr-1.3 md:mr-1.5"
              src="/photos-stack.svg"
              alt={`Number of photos in this entry.`}
              width={28}
              height={28}
            />
            <div className="text-base md:text-xl text-neutral-100">
              {images.url.length}
            </div>
          </div>
        </button>
      </Link>
      {showPopup && (
        <div className={`pointer-events-none `}>
          <DarkOverlay />
        </div>
      )}
      {showPopup && (
        <PhotosMainPopUp
          title={title}
          location={location}
          onClose={closePopUp}
          date={date}
          author={author}
          authorProfile={authorProfile}
          slug={slug}
          images={images}
          instagramLink={instagramLink}
        />
      )}
    </>
  );
};

export default PhotosTile;
