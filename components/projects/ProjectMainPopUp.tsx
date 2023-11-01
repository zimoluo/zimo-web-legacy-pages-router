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
import Link from "next/link";
import { useSettings } from "../contexts/SettingsContext";

export default function ProjectMainPopUp({
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

  const { settings } = useSettings();

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

    // Capturing the current value of instanceRef to ensure it remains stable throughout the effect and cleanup
    const currentInstance = instanceRef.current;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        // Check if this popup is the active one
        if (isActivePopup(currentInstance)) {
          // Remove the active popup
          window.history.replaceState({}, "", "#");
          // Add a 100ms delay to removeActivePopup
          removeActivePopup(currentInstance);

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
        removeActivePopup(currentInstance);
      }, 100);
    };
  }, [onClose]); // Remember to consider all dependencies here

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        window.history.replaceState({}, "", "#");
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
    <div className="fixed inset-0 flex items-center justify-center z-60 px-12 py-12 ">
      <article
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
            original={parsedImage.original}
            theme="projects"
            useHFull={true}
            forceGridViewCenter={false}
            defaultGridView={settings.preferInitialGridView}
          />
        </div>
        <div
          className="mx-0 md:ml-2 md:mr-2 overflow-auto"
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
      </article>
      <div className="absolute top-3 right-3 z-70 flex items-center justify-center">
        <Link href={`/projects/${slug}`}>
          <Image
            src="/expand-full-page.svg"
            alt="Enter Full Page"
            width={16}
            height={16}
            className="h-4 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
          />
        </Link>
        <button
          className="ml-4"
          onClick={() => {
            onClose();
            window.history.replaceState({}, "", "#");
          }}
        >
          <Image
            src="/image-view-cross.svg"
            alt="Close Album Window"
            width={16}
            height={16}
            className="h-4 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
          />
        </button>
      </div>
    </div>
  );
}
