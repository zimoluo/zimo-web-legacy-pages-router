import ProjectData from "@/interfaces/projects/projectData";
import ProjectTextSide from "./ProjectTextSide";
import ImageViewer from "../ImageViewer";
import {
  addActivePopup,
  imagesParser,
  isActivePopup,
  removeActivePopup,
} from "@/lib/util";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ProjectMainPopup({
  title,
  description,
  links,
  date,
  images,
  authors,
  slug,
  faviconFormat,
  content,
  onClose,
}: ProjectData & { onClose: () => void }) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);

  const textPartWidth = 800;
  const minimumWidth = 1000;

  const handleResize = () => {
    const vh = window.innerHeight * 0.8; // 80vh
    const vw = window.innerWidth * 0.6; // 60vw
    const calculatedHeight = Math.min(vh, vw);

    const [widthRatio, heightRatio] = images.aspectRatio.split(":").map(Number);
    const aspectRatio = widthRatio / heightRatio;

    const fixedWidth = calculatedHeight * aspectRatio;
    const totalWidth = Math.max(fixedWidth + textPartWidth, minimumWidth);

    setGridWidth(totalWidth);
    setGridHeight(calculatedHeight);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Initial styles when mounted becomes true
    setStyle({
      opacity: 0,
      transform: "scale(1.25)",
    });

    // Animate to final styles
    setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: "scale(1)",
        transition: "opacity 200ms, transform 200ms",
      });
    }, 100);
  }, []);

  const instanceRef = useRef({}); // Create a unique object reference

  useEffect(() => {
    // Mark this popup as active
    addActivePopup(instanceRef.current);

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        // Check if this popup is the active one
        if (isActivePopup(instanceRef.current)) {
          // Remove the active popup

          window.history.replaceState({}, '', '#');
          // Add a 100ms delay to removeActivePopup
          removeActivePopup(instanceRef.current);

          // Close the popup
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup
      window.removeEventListener("keydown", handleEscape);

      // Add a 100ms delay to removeActivePopup
      setTimeout(() => {
        removeActivePopup(instanceRef.current);
      }, 100);
    };
  }, [onClose]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        window.history.replaceState({}, '', '#');
        onClose();
      }
    };

    // Initial check
    handleResize();

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  const parsedImage = imagesParser(images);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 px-12 py-12">
      <div
        className="flex rounded-xl projects-popup-bg overflow-hidden opacity-0"
        style={{ ...style, width: `${gridWidth}px`, height: `${gridHeight}px` }}
      >
        <div
          className=""
          style={{
            height: `${gridHeight}px`,
          }}
        >
          <ImageViewer
            url={parsedImage.url}
            text={parsedImage.text}
            aspectRatio={parsedImage.aspectRatio}
            theme="projects"
            useHFull={true}
          />
        </div>
        <div
          className="mx-0 md:ml-2 md:mr-4 overflow-auto"
          style={{
            width: `${textPartWidth}px`,
            height: `${gridHeight}px`,
            maxWidth: `${textPartWidth}px`,
          }}
        >
          <ProjectTextSide
            title={title}
            description={description}
            links={links}
            date={date}
            authors={authors}
            slug={slug}
            faviconFormat={faviconFormat}
            content={content}
          />
        </div>
      </div>
      <button
        className="absolute top-3 right-3 z-50"
        onClick={() => {
          onClose();
          window.history.replaceState({}, '', '#');
        }}
      >
        <Image
          src="/image-view-cross.svg"
          alt="Close Project Window"
          width={16}
          height={16}
          className="h-4 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
        />
      </button>
    </div>
  );
}
