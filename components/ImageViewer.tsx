// ImageViewer.tsx
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import {
  applyImageViewerTransition,
  calculateGridViewTransformStyle,
} from "@/lib/util";
import ImagePopUp from "./ImagePopUp";
import DarkOverlay from "./DarkOverlay";
import { imagesArrowMap } from "@/interfaces/themeMaps";

function ImageViewer({
  url,
  aspectRatio,
  text = [],
  theme = "photos",
  useHFull = false,
}: ImagesData & { theme?: string; useHFull?: boolean }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [leftButtonVisible, setLeftButtonVisible] = useState(false);
  const [rightButtonVisible, setRightButtonVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const arrowSrc = imagesArrowMap[theme];

  const [isGridView, setGridView] = useState(false);

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

  useEffect(() => {
    if (isGridView) return;

    let initialX: number | null = null;

    function handleScroll(e: WheelEvent): void {
      if (e.deltaX !== 0) {
        e.preventDefault();
        if (e.deltaX > 30) {
          goToNextPage();
        } else if (e.deltaX < -30) {
          goToPreviousPage();
        }
      }
    }

    function handleTouchStart(e: TouchEvent): void {
      initialX = e.touches[0].clientX;
    }

    function handleTouchMove(e: TouchEvent): void {
      if (!initialX) return;

      const deltaX = e.touches[0].clientX - initialX;

      if (Math.abs(deltaX) > 30) {
        if (deltaX > 30) {
          goToPreviousPage();
        } else if (deltaX < -30) {
          goToNextPage();
        }
        initialX = null;
      }
    }

    function handleDoubleClick(): void {
      openPopup();
    }

    if (imageContainerRef.current) {
      imageContainerRef.current.addEventListener("wheel", handleScroll);
      imageContainerRef.current.addEventListener(
        "touchstart",
        handleTouchStart
      );
      imageContainerRef.current.addEventListener("touchmove", handleTouchMove);
      imageContainerRef.current.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (imageContainerRef.current) {
        imageContainerRef.current.removeEventListener("wheel", handleScroll);
        imageContainerRef.current.removeEventListener(
          "touchstart",
          handleTouchStart
        );
        imageContainerRef.current.removeEventListener(
          "touchmove",
          handleTouchMove
        );
        imageContainerRef.current.removeEventListener(
          "dblclick",
          handleDoubleClick
        );
      }
    };
  }, [imageContainerRef, goToNextPage, goToPreviousPage, isGridView]);

  const currentDescription = actualDescriptions[currentPage];

  return (
    <div
      className={`${useHFull ? "h-full" : "w-full"} relative`}
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
              priority={true}
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
          className={`absolute pointer-events-none bottom-12 left-1/2 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-sm px-3 py-1 rounded-3xl transform -translate-x-1/2 transition-opacity ease-out duration-300 max-w-96 overflow-hidden ${
            descriptionVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentDescription}
        </div>
      )}

      <div className="absolute top-2 right-2 z-10 flex">
        {!isGridView && url.length > 1 && (
          <button className={`mr-3`} onClick={enableGridView}>
            <Image
              src="/grid-view.svg"
              alt="Grid View"
              width={24}
              height={24}
              className="h-6 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
            />
          </button>
        )}

        {!isGridView && (
          <button className={`mr-2`} onClick={openPopup}>
            <Image
              src="/magnifying-glass.svg"
              alt="Zoom In"
              width={24}
              height={24}
              className="h-6 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
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
            src={arrowSrc}
            alt="Previous Image"
            width={24}
            height={24}
            className="h-6 w-auto opacity-80 transform transition-transform duration-300 hover:scale-125"
          />
        </button>
      )}

      {currentPage < url.length - 1 && rightButtonVisible && !isGridView && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
          onClick={goToNextPage}
        >
          <Image
            src={arrowSrc}
            alt="Next Image"
            width={24}
            height={24}
            className="h-6 w-auto rotate-180 opacity-80 transform transition-transform duration-300 hover:scale-125"
          />
        </button>
      )}

      {!isGridView && url.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <ImagePageIndicator
            totalPages={url.length}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </div>
      )}

      {showPopup && (
        <div className={`pointer-events-none `}>
          <DarkOverlay />
        </div>
      )}

      {showPopup && (
        <div className={``}>
          <ImagePopUp
            src={url[currentPage]}
            onClose={closePopup}
            altText={currentDescription}
          />
        </div>
      )}
    </div>
  );
}

export default ImageViewer;
