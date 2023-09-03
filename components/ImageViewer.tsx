// ImageViewer.tsx
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import {
  applyImageViewerTransition,
  calculateGridViewTransformStyle,
} from "@/lib/util";
import ImagePopUp from "./ImagePopUp";
import ImagePopUpBg from "./ImagePopUpBg";

function ImageViewer({ url, aspectRatio, text = [] }: ImagesData) {
  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [leftButtonVisible, setLeftButtonVisible] = useState(false);
  const [rightButtonVisible, setRightButtonVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [isGridView, setGridView] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const computeGridDimensions = (numImages: number) => {
    let dimension = Math.ceil(Math.sqrt(numImages));
    return dimension;
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const gridLength = computeGridDimensions(url.length);

  const actualDescriptions = text.length ? text : Array(url.length).fill("");

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);

  const setButtonVisibility = (page: number) => {
    if (page === 0) {
      setLeftButtonVisible(false);
    } else {
      setLeftButtonVisible(true);
    }

    if (page === url.length - 1) {
      setRightButtonVisible(false);
    } else {
      setRightButtonVisible(true);
    }
  };

  const goToPage = (page: number) => {
    setDescriptionVisible(false);
    setButtonVisibility(page);

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
    if (currentPage < url.length - 1) {
      goToPage(currentPage + 1);
    }
  };

  const enableGridView = () => {
    setGridView(true);
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(imageContainerRef.current.childNodes);

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === currentPage) {
            node.style.zIndex = "50";
            console.log(node.style.zIndex);
            container.style.transform = "translateX(0%)";
            node.style.transform = "translateX(0%)";
          }
        }
      });

      imageNodes.forEach((node, index) => {
        if (index === currentPage) return;

        if (node instanceof HTMLElement) {
          node.style.transition = "none 0s";
          node.style.transform = calculateGridViewTransformStyle(
            index,
            gridLength
          );
          node.style.zIndex = "1";
        }
      });

      // Delay third forEach loop by 0.1 seconds (100 milliseconds)
      setTimeout(() => {
        imageNodes.forEach((node, index) => {
          if (node instanceof HTMLElement) {
            if (index === currentPage) {
              node.style.transform = calculateGridViewTransformStyle(
                index,
                gridLength
              );
              node.style.transition = "all 0.2s ease-out";

              const handleTransitionEnd = () => {
                node.style.zIndex = "1";

                node.removeEventListener("transitionend", handleTransitionEnd);
              };

              node.addEventListener("transitionend", handleTransitionEnd);
            }
          }
        });
      }, 100);
    }
  };

  const turnOffGridView = (chosenIndex: number) => {
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(imageContainerRef.current.childNodes);
      setCurrentPage(chosenIndex);

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === chosenIndex) {
            node.style.transform = `translate(0%, 0%) scale(1.0)`;
            node.style.transition = "all 0.2s ease-out";
            node.style.zIndex = "50";

            const handleTransitionEnd = () => {
              imageNodes.forEach((node, index) => {
                if (index === chosenIndex) return;

                if (node instanceof HTMLElement) {
                  node.style.transition = "none 0s";
                  node.style.transform = `translate(${
                    index * 100
                  }%, 0%) scale(1.0)`;
                  node.style.zIndex = "1";
                }
              });

              setTimeout(() => {
                imageNodes.forEach((node, index) => {
                  if (node instanceof HTMLElement) {
                    if (index === chosenIndex) {
                      node.style.zIndex = "1";
                      console.log(node.style.zIndex);
                      container.style.transition = "none 0s";
                      container.style.transform = `translate(${
                        -index * 100
                      }%, 0%)`;
                      node.style.transition = "none 0s";
                      node.style.transform = `translate(${index * 100}%, 0%)`;
                    }
                  }
                });
                setButtonVisibility(chosenIndex);
                setGridView(false);
              }, 100);

              // Remove the event listener to avoid multiple calls
              node.removeEventListener("transitionend", handleTransitionEnd);
            };

            node.addEventListener("transitionend", handleTransitionEnd);
          }
        }
      });
    }
  };

  const currentDescription = actualDescriptions[currentPage];

  return (
    <div
      className="w-full relative"
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
          isGridView ? "" : "rounded-xl"
        }`}
      >
        <div ref={imageContainerRef} className="flex w-full h-full">
          {url.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={actualDescriptions[index] || `Image ${index}`}
              className={`absolute inset-0 w-full h-full object-cover ${
                isGridView ? "cursor-pointer rounded-xl" : ""
              }`}
              height={heightRatio * 1000}
              width={widthRatio * 1000}
              unoptimized={false}
              priority={false}
              style={{
                transform: `translateX(${index * 100}%)`,
              }}
              onClick={() => isGridView && turnOffGridView(index)}
            />
          ))}
        </div>
      </div>

      {currentDescription && !isGridView && (
        <div
          className={`absolute bottom-12 left-1/2 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-sm px-3 py-1 rounded-3xl transform -translate-x-1/2 transition-opacity ease-out duration-300 max-w-96 overflow-hidden ${
            descriptionVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentDescription}
        </div>
      )}

      <div className="absolute top-2 right-2 z-50 flex">
        {!isGridView && (
          <button className={`mr-2 `} onClick={enableGridView}>
            <Image
              src="/blog-zimo.svg" // Replace with your right arrow sprite path
              alt="Grid View"
              width={48}
              height={48}
              className="h-8 w-auto"
            />
          </button>
        )}

        {!isGridView && (
          <button className={``} onClick={openPopup}>
            <Image
              src="/zimo-favicon.svg" // Replace with your zoom icon sprite path
              alt="Zoom In"
              width={48}
              height={48}
              className="h-8 w-auto"
            />
          </button>
        )}
      </div>

      {currentPage > 0 && leftButtonVisible && !isGridView && (
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
          onClick={goToPreviousPage}
        >
          <Image
            src="/favicon.svg" // Replace with your left arrow sprite path
            alt="Previous Image"
            width={48}
            height={48}
            className="h-8 w-auto"
          />
        </button>
      )}

      {currentPage < url.length - 1 && rightButtonVisible && !isGridView && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
          onClick={goToNextPage}
        >
          <Image
            src="/photos-zimo.svg" // Replace with your right arrow sprite path
            alt="Next Image"
            width={48}
            height={48}
            className="h-8 w-auto"
          />
        </button>
      )}

      {/* Pagination Circles */}
      {!isGridView && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <ImagePageIndicator
            totalPages={url.length}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </div>
      )}

      {showPopup && (
        <div
          className={`transition-opacity ease-in-out duration-0 pointer-events-none `}
        >
          <ImagePopUpBg onClose={closePopup} />
        </div>
      )}

      {
        <div
          className={`transition-opacity ease-out duration-100 ${
            showPopup ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ImagePopUp src={url[currentPage]} onClose={closePopup} />
        </div>
      }
    </div>
  );
}

export default ImageViewer;
