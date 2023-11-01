import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import { useEffect, useState } from "react";
import PhotosTextSide from "./PhotosTextSide";
import PhotosCommentArea from "./PhotosCommentArea";
import { useSettings } from "../contexts/SettingsContext";
import { securityCommentShutDown } from "@/lib/constants";

export default function PhotosMainDesktop({
  title,
  location,
  date,
  author,
  authorProfile,
  slug,
  images,
  instagramLink,
}: PhotosData) {
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const { settings } = useSettings();

  const [isCommentBoxExpanded, setIsCommentBoxExpanded] =
    useState<boolean>(true);

  const textPartWidth = 400;
  const minimumWidth = 0;

  const handleResize = () => {
    const vh = window.innerHeight * 0.8;
    const vw = window.innerWidth * 0.64;
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
        className="flex rounded-xl bg-orange-50 overflow-hidden"
        style={{
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
        }}
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
            theme="photos"
            useHFull={true}
            forceGridViewCenter={false}
            defaultGridView={settings.preferInitialGridView}
          />
        </div>
        <div
          className="mx-1 overflow-auto relative"
          style={{
            width: `${textPartWidth}px`,
            height: `${gridHeight}px`,
            maxWidth: `${textPartWidth}px`,
          }}
        >
          <div className="overflow-y-auto h-full">
            <div className={`${isCommentBoxExpanded ? "mb-52" : "mb-14"}`}>
              <PhotosTextSide
                title={title}
                date={date}
                slug={slug}
                author={author}
                authorProfile={authorProfile}
                location={location}
                instagramLink={instagramLink}
              />
            </div>
          </div>
          {!settings.disableComments && !securityCommentShutDown && (
            <div className="absolute bottom-0 w-full">
              <PhotosCommentArea
                slug={slug}
                isExpanded={isCommentBoxExpanded}
                setIsExpanded={setIsCommentBoxExpanded}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
