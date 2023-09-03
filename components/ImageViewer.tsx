// ImageViewer.tsx
import React, { useState, useRef } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import { applyImageViewerTransition } from "@/lib/util";

type Props = {
  images: string[];
  aspectRatio: string;
  descriptions?: string[];
};

const ImageViewer: React.FC<Props> = ({
  images,
  aspectRatio,
  descriptions = [],
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const actualDescriptions = descriptions.length
    ? descriptions
    : Array(images.length).fill("");

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);

  const goToPage = (page: number) => {
    setDescriptionVisible(false);
    if (imageContainerRef.current) {
      const transform = `translateX(-${page * 100}%)`;
      applyImageViewerTransition(
        imageContainerRef.current,
        transform,
        0.25,
        () => {
          setCurrentPage(page);
          setDescriptionVisible(true);
        }
      );
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < images.length - 1) {
      goToPage(currentPage + 1);
    }
  };

  const currentDescription = actualDescriptions[currentPage];

  return (
    <div className="border-4 border-neutral-800 w-full h-full flex items-center justify-center">
      <div
        className="w-full relative"
        style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div ref={imageContainerRef} className="flex w-full h-full">
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={actualDescriptions[index] || `Image ${index}`}
                className="absolute inset-0 w-full h-full object-cover"
                height={heightRatio * 1000}
                width={widthRatio * 1000}
                unoptimized={false}
                priority={true}
                style={{
                  transform: `translateX(${index * 100}%)`,
                }}
              />
            ))}
          </div>
        </div>

        {currentDescription && (
          <div
            className={`absolute bottom-12 left-1/2 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-sm px-3 py-1 rounded-3xl transform -translate-x-1/2 transition-opacity ease-out duration-300 max-w-96 overflow-hidden ${
              descriptionVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {currentDescription}
          </div>
        )}

        {/* Pagination Circles */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <ImagePageIndicator
            totalPages={images.length}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </div>

        {currentPage > 0 && (
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
            onClick={goToPreviousPage}
          >
            <Image
              src="/favicon.svg" // Replace with your left arrow sprite path
              alt="Previous Image"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </button>
        )}

        {currentPage < images.length - 1 && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
            onClick={goToNextPage}
          >
            <Image
              src="/photos-zimo.svg" // Replace with your right arrow sprite path
              alt="Next Image"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
