import PhotosCard from "./PhotosCard";
import CommentCardColumn from "../comments/CommentCardColumn";
import { useSettings } from "../contexts/SettingsContext";
import { securityCommentShutDown } from "@/lib/constants";

type Props = {
  title: string;
  date: string;
  author: string;
  authorProfile: string;
  location?: LocationData;
  slug: string;
  instagramLink?: string;
};

const PhotosTextSide = ({
  title,
  location,
  date,
  author,
  authorProfile,
  slug,
  instagramLink,
}: Props) => {
  const { settings } = useSettings();

  return (
    <article className="w-full px-4 pt-4 pb-4">
      <PhotosCard
        title={title}
        date={date}
        author={author}
        authorProfile={authorProfile}
        location={location}
        instagramLink={instagramLink}
      />
      <div className="border-orange-700 border-opacity-80 border-photos-comment -mt-10 mb-8 -mx-4 select-none pointer-events-none" />
      {!settings.disableComments && !securityCommentShutDown && (
        <CommentCardColumn
          theme="photos"
          resourceLocation={`photos/comments/${slug}.json`}
        />
      )}
    </article>
  );
};

export default PhotosTextSide;
