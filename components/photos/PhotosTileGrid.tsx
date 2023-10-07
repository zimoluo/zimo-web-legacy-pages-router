import React, { useEffect, useRef, useState } from "react";
import PhotosTile from "./PhotosTile";

interface Props {
  photoEntries: PhotosData[];
}

const PhotosTileGrid: React.FC<Props> = ({ photoEntries }) => {
  const gridRefDesktop = useRef<HTMLDivElement>(null);
  const gridRefMobile = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
  }, [photoEntries, windowWidth]);

  return (
    <>
      <section
        className={`flex justify-center mb-16 px-1.5 transition-opacity duration-500 ease-in-out ${
          isLoaded && windowWidth >= 768
            ? "opacity-100"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div ref={gridRefDesktop}>
          {photoEntries.map((photoEntry, index) => (
            <div key={index} className="masonry-item">
              <PhotosTile {...photoEntry} />
            </div>
          ))}
        </div>
      </section>
      <section
        className={`flex justify-center mb-16 px-1.5 transition-opacity duration-500 ease-in-out ${
          isLoaded && windowWidth < 768
            ? "opacity-100"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div ref={gridRefMobile}>
          {photoEntries.map((photoEntry, index) => (
            <div key={index} className="masonry-item">
              <PhotosTile {...photoEntry} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PhotosTileGrid;
