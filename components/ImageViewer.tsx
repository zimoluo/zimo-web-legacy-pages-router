// ImageViewer.tsx
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import { enrichTextContent, restoreDisplayText } from "@/lib/util";
import ImagePopUp from "./ImagePopUp";
import DarkOverlay from "./DarkOverlay";
import { imageViewerPlaceholder, imagesArrowMap } from "@/interfaces/themeMaps";
import { useSettings } from "./contexts/SettingsContext";
import Head from "next/head";

const applyImageViewerTransition = (
  element: HTMLElement,
  transform: string,
  duration: number,
  onComplete: () => void
) => {
  element.style.transition = `transform ${duration}s ease-out`;
  element.style.transform = transform;

  const onTransitionEnd = () => {
    element.style.transition = "none";
    element.removeEventListener("transitionend", onTransitionEnd);
    onComplete();
  };

  element.addEventListener("transitionend", onTransitionEnd);
};

const computeGridDimensions = (numImages: number) => {
  const dimension = Math.ceil(Math.sqrt(numImages));
  return dimension;
};

function ImageViewer({
  url,
  aspectRatio,
  text = [],
  theme = "photos",
  original = [],
  useHFull = false,
  defaultGridView = false,
  forceGridViewCenter = true,
}: ImagesData & {
  theme?: string;
  useHFull?: boolean;
  defaultGridView?: boolean;
  forceGridViewCenter?: boolean;
}) {
  const evaluatedDefaultGridView = defaultGridView && url.length > 1;

  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [leftButtonVisible, setLeftButtonVisible] = useState(false);
  const [rightButtonVisible, setRightButtonVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [hideDescription, setHideDescription] = useState(false);
  const [pageFlipGridViewFlag, setPageFlipGridViewFlag] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isGridView, setGridView] = useState(evaluatedDefaultGridView);
  const { settings } = useSettings();

  const arrowSrc = imagesArrowMap[theme];

  const gridLength = computeGridDimensions(url.length);

  const actualDescriptions = text.length ? text : Array(url.length).fill("");

  const safeOriginal: string[] = original
    ? original.length === url.length // if lengths are equal, use original
      ? original
      : original.length < url.length // if original is shorter, append empty strings
      ? [...original, ...new Array(url.length - original.length).fill("")]
      : original.slice(0, url.length) // if original is longer, clip it to match url's length
    : new Array(url.length).fill("");

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);

  const calculateGridViewTransformStyle = (index: number) => {
    const gridPosition = index % gridLength;
    const rowCoordinate = Math.floor(index / gridLength);
    const maxRowNum = Math.ceil(url.length / gridLength);
    const adjustedRowCoordinate = forceGridViewCenter
      ? rowCoordinate + (gridLength - maxRowNum) / 2
      : rowCoordinate;

    const xTranslation =
      (gridPosition / gridLength - 0.5 + 0.5 / gridLength) * 100;
    const yTranslation =
      (adjustedRowCoordinate / gridLength - 0.5 + 0.5 / gridLength) * 100;
    const scale = 1 / gridLength - 0.008;

    return `translate(${xTranslation}%, ${yTranslation}%) scale(${scale})`;
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
    setPageFlipGridViewFlag(false);
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
          setPageFlipGridViewFlag(true);
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
    if (!pageFlipGridViewFlag) return;
    if (!(url.length > 1)) return;

    setGridView(true);
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(container.childNodes);

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
          node.style.transform = calculateGridViewTransformStyle(index);
          node.style.zIndex = "-1";
        }
      });

      setTimeout(() => {
        imageNodes.forEach((node, index) => {
          if (node instanceof HTMLElement) {
            if (index === currentPage) {
              node.style.transform = calculateGridViewTransformStyle(index);
              node.style.transition = "all 0.2s ease-out";

              const handleTransitionEnd = () => {
                node.style.zIndex = "-1";
                node.removeEventListener("transitionend", handleTransitionEnd);
              };

              node.addEventListener("transitionend", handleTransitionEnd);
            }
          }
        });
      }, 0);
    }
  };

  const turnOffGridView = (chosenIndex: number) => {
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(container.childNodes);
      setCurrentPage(chosenIndex);

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === chosenIndex) {
            node.style.transform = "translate(0%, 0%) scale(1.0)";
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
                  node.style.zIndex = "-1";
                }
              });

              setTimeout(() => {
                imageNodes.forEach((node, index) => {
                  if (node instanceof HTMLElement) {
                    if (index === chosenIndex) {
                      node.style.zIndex = "-1";
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
              }, 0);

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

    if (settings.disableGestures) return;

    let initialX: number | null = null;
    let initialDeltaY: number | null = null;
    let initialDistance: number | null = null;

    function handleScroll(e: WheelEvent): void {
      // Normal scrolling
      if (e.deltaX !== 0) {
        e.preventDefault();
        if (e.deltaX > 30) {
          goToNextPage();
        } else if (e.deltaX < -30) {
          goToPreviousPage();
        }
        return;
      }

      // Pinch-to-zoom using trackpad
      if (e.ctrlKey) {
        e.preventDefault();
        if (initialDeltaY === null) {
          initialDeltaY = e.deltaY;
        } else {
          if (initialDeltaY - e.deltaY < 0 && initialDeltaY + e.deltaY > 0) {
            enableGridView();
            initialDeltaY = null; // Reset to stop continuous triggering
          }
        }
      }
    }

    function handleTouchStart(e: TouchEvent): void {
      if (e.touches.length === 2) {
        initialDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );
      } else if (e.touches.length === 1) {
        initialX = e.touches[0].clientX;
      }
    }

    function handleTouchMove(e: TouchEvent): void {
      if (e.touches.length === 2 && initialDistance !== null) {
        e.preventDefault();
        const currentDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );

        // If the distance between two fingers decreased by 30 or more
        if (initialDistance - currentDistance > 30) {
          enableGridView();
          initialDistance = null; // Reset to stop continuous triggering
        }
      } else if (e.touches.length === 1 && initialX !== null) {
        const deltaX = e.touches[0].clientX - initialX;

        if (Math.abs(deltaX) > 30) {
          e.preventDefault();
          if (deltaX > 30) {
            goToPreviousPage();
          } else if (deltaX < -30) {
            goToNextPage();
          }
          initialX = null;
        }
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
      imageContainerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
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

  const currentDescription = actualDescriptions[currentPage].trim() as string;

  function flipSubtitleButton() {
    if (!currentDescription) {
      setHideDescription(false);
      return;
    }
    setHideDescription(!hideDescription);
  }

  useEffect(() => {
    if (!currentDescription || isGridView) {
      setHideDescription(false);
    }
  }, [currentDescription, isGridView]);

  return (
    <figure
      className={`${useHFull ? "h-full" : "w-full"} relative`}
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
    >
      <Head>
        <link rel="preload" as="image" href={arrowSrc} />
        <link rel="preload" as="image" href="/show-subtitle.svg" />
        <link rel="preload" as="image" href="/grid-view.svg" />
        <link rel="preload" as="image" href="/magnifying-glass.svg" />
      </Head>
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden z-0 ${
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
              height={Math.min(
                1000,
                Math.round((1000 / widthRatio) * heightRatio)
              )}
              width={Math.min(
                1000,
                Math.round((1000 / heightRatio) * widthRatio)
              )}
              priority={true}
              style={{
                transform: evaluatedDefaultGridView
                  ? calculateGridViewTransformStyle(index)
                  : `translateX(${index * 100}%)`,
              }}
              onClick={() => isGridView && turnOffGridView(index)}
              placeholder="blur"
              blurDataURL={imageViewerPlaceholder[theme]}
              role={isGridView ? "button" : undefined}
            />
          ))}
        </div>
      </div>

      {currentDescription && !isGridView && (
        <div
          className={`absolute pointer-events-none image-view-description-position z-10 left-1/2 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-sm px-3.5 py-1 rounded-3xl transform -translate-x-1/2 transition-opacity ease-out duration-300 max-w-96 overflow-hidden ${
            descriptionVisible && !hideDescription ? "opacity-100" : "opacity-0"
          }`}
        >
          {enrichTextContent(currentDescription)}
        </div>
      )}

      {!isGridView && (
        <div className="absolute top-2 right-2 z-10 flex bg-neutral-600 bg-opacity-40 rounded-full py-1.5 px-3">
          {currentDescription && (
            <button className="mr-3" onClick={flipSubtitleButton}>
              <Image
                src="/show-subtitle.svg"
                alt="Show or Hide Subtitle"
                width={24}
                height={24}
                className="h-6 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-110 md:hover:scale-125"
              />
            </button>
          )}

          {url.length > 1 && (
            <button className="mr-3" onClick={enableGridView}>
              <Image
                src="/grid-view.svg"
                alt="Grid View"
                width={24}
                height={24}
                className="h-6 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-110 md:hover:scale-125"
              />
            </button>
          )}
          <button className="" onClick={openPopup}>
            <Image
              src="/magnifying-glass.svg"
              alt="Zoom In"
              width={24}
              height={24}
              className="h-6 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-110 md:hover:scale-125"
            />
          </button>
        </div>
      )}

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
            className="h-6 w-auto opacity-80 transform transition-transform duration-300 hover:scale-110 md:hover:scale-125"
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
            className="h-6 w-auto rotate-180 opacity-80 transform transition-transform duration-300 hover:scale-110 md:hover:scale-125"
          />
        </button>
      )}

      {!isGridView && url.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 max-w-full px-5">
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
        <ImagePopUp
          src={
            safeOriginal[currentPage]
              ? safeOriginal[currentPage]
              : url[currentPage]
          }
          onClose={closePopup}
          altText={restoreDisplayText(currentDescription)}
        />
      )}
    </figure>
  );
}

export default ImageViewer;
