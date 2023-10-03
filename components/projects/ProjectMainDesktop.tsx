import ProjectData from "@/interfaces/projects/projectData";
import ProjectTextSide from "./ProjectTextSide";
import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import { useEffect, useState } from "react";

export default function ProjectMainDesktop({
  title,
  description,
  links,
  date,
  images,
  authors,
  slug,
  faviconFormat,
  content,
}: ProjectData) {
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
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const parsedImage = imagesParser(images);

  return (
    <div className="min-h-screen hidden items-center justify-center px-12 py-12 md:flex mb-3">
      <article
        className="flex rounded-xl projects-popup-bg overflow-hidden"
        style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
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
    </div>
  );
}
