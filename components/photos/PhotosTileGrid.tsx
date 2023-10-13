import React, { useEffect, useRef, useState } from "react";
import PhotosTile from "./PhotosTile";
import { useSettings } from "../contexts/SettingsContext";
import PhotosGallery from "./PhotosGallery";
import PhotosModeSwitch from "./PhotosModeSwitch";

interface Props {
  photoEntries: PhotosData[];
}

const PhotosTileGrid: React.FC<Props> = ({ photoEntries }) => {
  const gridRefDesktop = useRef<HTMLDivElement>(null);
  const gridRefMobile = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useSettings();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let masonryDesktop: any, masonryMobile: any;

    import("masonry-layout").then((Masonry) => {
      if (windowWidth >= 768 && gridRefDesktop.current) {
        masonryDesktop = new Masonry.default(gridRefDesktop.current, {
          itemSelector: ".masonry-item",
          columnWidth: 288,
          gutter: 6,
          fitWidth: true,
        });
        setIsLoaded(true);
      } else if (gridRefMobile.current) {
        masonryMobile = new Masonry.default(gridRefMobile.current, {
          itemSelector: ".masonry-item",
          columnWidth: 168,
          gutter: 6,
          fitWidth: true,
        });
        setIsLoaded(true);
      }
    });

    return () => {
      // Destroy Masonry instances on cleanup
      masonryDesktop && masonryDesktop.destroy();
      masonryMobile && masonryMobile.destroy();
    };
  }, [photoEntries, windowWidth, settings.enableGallery]);

  return (
    <>
      <section
        className={`flex justify-center px-1.5 transition-opacity duration-500 ease-in-out ${
          isLoaded && windowWidth >= 768
            ? "opacity-100 mb-16"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div ref={gridRefDesktop} className="relative">
          <div className="absolute top-0 right-0 -translate-y-20">
            <PhotosModeSwitch />
          </div>
          {photoEntries.map((photoEntry, index) =>
            !settings.enableGallery ? (
              <div key={index} className="masonry-item">
                <PhotosTile {...photoEntry} />
              </div>
            ) : (
              photoEntry.images.url.map((url, imageUrlIndex) => (
                <div key={imageUrlIndex} className="masonry-item">
                  <PhotosGallery
                    url={url}
                    aspectRatio={photoEntry.images.aspectRatio}
                    title={photoEntry.title}
                    text={
                      photoEntry.images.text &&
                      photoEntry.images.text[imageUrlIndex] !== undefined
                        ? photoEntry.images.text[imageUrlIndex]
                        : ""
                    }
                  />
                </div>
              ))
            )
          )}
        </div>
      </section>
      <section
        className={`flex justify-center px-1.5 transition-opacity duration-500 ease-in-out ${
          isLoaded && windowWidth < 768
            ? "opacity-100 mb-16"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div ref={gridRefMobile} className="relative">
          <div className="absolute top-0 right-0 -translate-y-14">
            <PhotosModeSwitch />
          </div>
          {photoEntries.map((photoEntry, index) =>
            !settings.enableGallery ? (
              <div key={index} className="masonry-item">
                <PhotosTile {...photoEntry} />
              </div>
            ) : (
              photoEntry.images.url.map((url, imageUrlIndex) => (
                <div key={imageUrlIndex} className="masonry-item">
                  <PhotosGallery
                    url={url}
                    aspectRatio={photoEntry.images.aspectRatio}
                    title={photoEntry.title}
                    text={
                      photoEntry.images.text &&
                      photoEntry.images.text[imageUrlIndex] !== undefined
                        ? photoEntry.images.text[imageUrlIndex]
                        : ""
                    }
                  />
                </div>
              ))
            )
          )}
        </div>
      </section>
    </>
  );
};

export default PhotosTileGrid;
