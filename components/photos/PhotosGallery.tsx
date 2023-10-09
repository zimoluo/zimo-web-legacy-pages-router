import Image from "next/image";
import { useMemo } from "react";
import { rgbaDataURL } from "@/lib/util";

const PhotosGallery = ({
  url,
  aspectRatio,
  title,
}: {
  url: string;
  title: string;
  aspectRatio: string;
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

  return (
    <div
      className="w-42 md:w-72 h-auto rounded-xl overflow-hidden mb-1.5"
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
    </div>
  );
};

export default PhotosGallery;
