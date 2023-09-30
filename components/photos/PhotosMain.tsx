import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import { CommentProvider } from "../contexts/CommentContext";
import PhotosCard from "./PhotosCard";
import CommentCardColumn from "../comments/CommentCardColumn";
import PhotosCommentAreaMobile from "./PhotosCommentAreaMobile";

export default function PhotosMain({
  title,
  location,
  date,
  author,
  authorProfile,
  slug,
  images,
}: PhotosData) {
  const parsedImage = imagesParser(images);

  return (
    <CommentProvider>
      <article className="pt-16 px-4 pb-4 bg-orange-50 bg-opacity-80">
        <PhotosCard
          title={title}
          date={date}
          author={author}
          authorProfile={authorProfile}
          location={location}
        />
        <div className="-mt-8">
          <ImageViewer
            url={parsedImage.url}
            text={parsedImage.text}
            aspectRatio={parsedImage.aspectRatio}
            theme="photos"
          />
        </div>
        <div className="mt-10">
          <PhotosCommentAreaMobile slug={slug} />
          <CommentCardColumn
            theme="photos"
            resourceLocation={`photos/comments/${slug}.json`}
          />
        </div>
      </article>
    </CommentProvider>
  );
}
