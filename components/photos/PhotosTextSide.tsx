import PhotosCard from "./PhotosCard";
import CommentCardColumn from "../comments/CommentCardColumn";
import PhotosCommentArea from "./PhotosCommentArea";
import { CommentProvider } from "../contexts/CommentContext";

type Props = {
  title: string;
  date: string;
  author: string;
  authorProfile: string;
  location?: LocationData;
  slug: string;
};

const PhotosTextSide = ({
  title,
  location,
  date,
  author,
  authorProfile,
  slug,
}: Props) => {
  return (
    <CommentProvider>
      <article className="w-full relative">
        <div className="px-4 pt-4 pb-4 md:pb-52 overflow-y-auto" style={{height:"100rem"}}>
          <PhotosCard
            title={title}
            date={date}
            author={author}
            authorProfile={authorProfile}
            location={location}
          />
          <CommentCardColumn
            theme="photos"
            resourceLocation={`photos/comments/${slug}.json`}
          />
        </div>
        <div className="absolute bottom-0 w-full">
          <PhotosCommentArea slug={slug} />
        </div>
      </article>
    </CommentProvider>
  );
};

export default PhotosTextSide;
