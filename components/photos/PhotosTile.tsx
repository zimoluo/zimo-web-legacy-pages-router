import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import DarkOverlay from "../DarkOverlay";
import PhotosMainPopUp from "./PhotosMainPopUp";

const PhotosTile = ({
  images,
  title,
  date,
  author,
  authorProfile,
  slug,
  location,
}: PhotosData) => {
  const [widthRatio, heightRatio] = images.aspectRatio.split(":").map(Number);
  const [showPopup, setShowPopup] = useState(false);

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
          className="w-32 md:w-72 h-auto rounded-xl overflow-hidden relative group"
          style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
          onClick={(e) => {
            if (window.innerWidth >= 768) {
              e.preventDefault();
              openPopUp();
            }
          }}
        >
          <Image
            className="object-center w-full h-full object-cover"
            src={images.url[0]}
            alt={title}
            width={288}
            height={(288 / widthRatio) * heightRatio}
          />
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 select-none transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 `}
          />
          <div className="flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100">
            <Image
              className="aspect-square w-4 md:w-7 h-auto mr-1 md:mr-2"
              src="/photos-stack.svg"
              alt={"Number of photos"}
              width={16}
              height={16}
            />
            <div className="text-sm md:text-xl text-neutral-100">
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
        />
      )}
    </>
  );
};

export default PhotosTile;
