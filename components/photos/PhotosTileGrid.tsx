import React, { useEffect, useRef } from "react";
import PhotosTile from "./PhotosTile";

interface Props {
  photoEntries: PhotosData[];
}

const PhotosTileGrid: React.FC<Props> = ({ photoEntries }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      import("masonry-layout").then((Masonry) => {
        const columnWidth = window.innerWidth < 768 ? 128 : 288;

        new Masonry.default(gridRef.current as Element, {
          itemSelector: ".masonry-item",
          columnWidth: columnWidth,
          gutter: 6,
          fitWidth: true,
        });
      });
    }
  }, [photoEntries]);

  return (
    <section className="flex justify-center mb-16">
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
