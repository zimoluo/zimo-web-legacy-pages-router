import React, { useEffect, useRef, useState } from "react";
import PhotosTile from "./PhotosTile";

interface Props {
  photoEntries: PhotosData[];
}

const PhotosTileGrid: React.FC<Props> = ({ photoEntries }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (gridRef.current) {
      import("masonry-layout").then((Masonry) => {
        const columnWidth = window.innerWidth < 768 ? 168 : 288;

        new Masonry.default(gridRef.current as Element, {
          itemSelector: ".masonry-item",
          columnWidth: columnWidth,
          gutter: 6,
          fitWidth: true,
        });

        // Set the loaded state to true once Masonry is initialized.
        setIsLoaded(true);
      });
    }
  }, [photoEntries]);

  return (
    <section
      className={`flex justify-center mb-16 px-1.5 transition-opacity duration-500 ease-in-out ${
        isLoaded ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"
      }`}
    >
      <div ref={gridRef}>
        {photoEntries.map((photoEntry, index) => (
          <div key={index} className="masonry-item">
            <PhotosTile {...photoEntry} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotosTileGrid;
