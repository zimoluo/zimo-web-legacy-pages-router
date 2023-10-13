import Image from "next/image";
import { useMemo } from "react";
import { enrichTextContent, rgbaDataURL } from "@/lib/util";

const PhotosGallery = ({
  url,
  aspectRatio,
  title,
  text = "",
}: {
  url: string;
  title: string;
  aspectRatio: string;
  text?: string;
}) => {
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

  const seed = useMemo(() => stringToSeed(url), [url]);
  const rng = useMemo(() => new Xorshift(seed), [seed]);
  const randomMultiplier = useMemo(() => 0.8 + rng.next() * 0.4, [rng]);

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
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

  const displayText = text.trim();

  return (
    <div
      className="w-42 md:w-72 h-auto rounded-xl overflow-hidden mb-1.5 relative group"
      style={{ aspectRatio: `${computedAspectRatio}` }}
    >
      <Image
        className="object-center w-full h-full object-cover"
        src={url}
        alt={`Gallery of ${title}`}
        width={288}
        height={288 / computedAspectRatio}
        placeholder="blur"
        blurDataURL={rgbaDataURL(255, 237, 213, 0.85)}
      />
      {displayText && (
        <p className="absolute left-1/2 -translate-x-1/2 bottom-4 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-xs md:text-sm px-3 py-1 rounded-3xl overflow-hidden transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          {enrichTextContent(displayText)}
        </p>
      )}
    </div>
  );
};

export default PhotosGallery;
