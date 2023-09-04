import ProjectData from "@/interfaces/projects/projectData";
import ProjectTextSide from "./ProjectTextSide";
import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  entry: ProjectData;
  onClose: () => void;
};

export default function ProjectMainPopup({ entry, onClose }: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);

  const handleResize = () => {
    const vh = window.innerHeight * 0.8; // 80vh
    const vw = window.innerWidth * 0.8; // 80vw
    const calculatedHeight = Math.min(vh, vw);
    const aspectRatio = 3 / 4;
    
    const fixedWidth = calculatedHeight * aspectRatio;
    const totalWidth = fixedWidth + window.innerWidth * 0.5; // Adding minWidth for the right column (20vw)

    setGridWidth(totalWidth);
    setGridHeight(calculatedHeight);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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

  const parsedImage = imagesParser(entry.images);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-12 py-12">
      <div className="grid grid-cols-2 rounded-xl bg-projects-bg-light overflow-hidden opacity-0" style={{...style, width: `${gridWidth}px`, height: `${gridHeight}px` }}>
        <div className="" style={{
          height: `${gridHeight}px`,
        }}>
          <ImageViewer
            url={parsedImage.url}
            text={parsedImage.text}
            aspectRatio={parsedImage.aspectRatio}
            theme="projects"
            useHFull={true}
          />
        </div>
        <div className="mx-0 md:ml-2 md:mr-4 max-h-full h-full overflow-auto" style={{
          minWidth: '40vw',

          height: `${gridHeight}px`,
        }}>
          <ProjectTextSide
            title={entry.title}
            description={entry.description}
            links={entry.links}
            date={entry.date}
            authors={entry.authors}
            slug={entry.slug}
            faviconFormat={entry.faviconFormat}
            content={entry.content}
          />
        </div>
      </div>
      <button className="absolute top-4 right-4 z-50" onClick={onClose}>
        <Image
          src="/image-view-cross.svg"
          alt="Close Image Window"
          width={32}
          height={32}
          className="h-8 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
        />
      </button>
    </div>
  );
}
