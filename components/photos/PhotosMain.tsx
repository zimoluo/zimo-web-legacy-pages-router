import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import { CommentProvider } from "../contexts/CommentContext";
import PhotosCard from "./PhotosCard";
import CommentCardColumn from "../comments/CommentCardColumn";
import PhotosCommentAreaMobile from "./PhotosCommentAreaMobile";
import { useSettings } from "../contexts/SettingsContext";
import { securityCommentShutDown } from "@/lib/constants";
import PhotosMainDesktop from "./PhotosMainDesktop";
import { useEffect, useState } from "react";

export default function PhotosMain({
  title,
  location,
  date,
  author,
  authorProfile,
  slug,
  images,
  instagramLink,
}: PhotosData) {
  const parsedImage = imagesParser(images);
  const { settings } = useSettings();

  const [shouldRender, setShouldRender] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const handleResize = () => {
      setShouldRender(window.innerWidth >= 768 ? 1 : 2);
    };

    // Initial set of shouldRender after initial rendering
    handleResize();

    // Adding event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup: removing event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <CommentProvider>
      {(shouldRender === 0 || shouldRender === 1) && (
        <PhotosMainDesktop
          title={title}
          date={date}
          author={author}
          authorProfile={authorProfile}
          slug={slug}
          images={images}
          instagramLink={instagramLink}
        />
      )}
      {(shouldRender === 0 || shouldRender === 2) && (
        <article className="pt-16 px-4 pb-4 bg-orange-50 bg-opacity-80 md:hidden">
          <PhotosCard
            title={title}
            date={date}
            author={author}
            authorProfile={authorProfile}
            location={location}
            instagramLink={instagramLink}
          />
          <div className="-mt-8">
            <ImageViewer
              url={parsedImage.url}
              text={parsedImage.text}
              aspectRatio={parsedImage.aspectRatio}
              original={parsedImage.original}
              theme="photos"
            />
          </div>
          {!settings.disableComments && !securityCommentShutDown && (
            <div className="mt-10">
              <PhotosCommentAreaMobile slug={slug} />
              <CommentCardColumn
                theme="photos"
                resourceLocation={`photos/comments/${slug}.json`}
              />
            </div>
          )}
        </article>
      )}
    </CommentProvider>
  );
}
