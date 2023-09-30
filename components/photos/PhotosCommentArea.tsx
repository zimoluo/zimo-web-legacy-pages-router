import GeneralLikeButton from "../comments/GeneralLikeButton";
import CommentTypeBox from "../comments/CommentTypeBox";

type Props = {
  slug: string;
};

const PhotosCommentArea = ({ slug }: Props) => {
  return (
    <div className="border-photos-comment border-orange-700 border-opacity-80 px-5 pt-4 py-1 bg-orange-50 bg-opacity-50 backdrop-blur-md">
      <GeneralLikeButton
        theme="photos"
        resourceLocation={`photos/likedBy/${slug}.json`}
      />
      <CommentTypeBox theme="photos" isExpanded={true} />
    </div>
  );
};

export default PhotosCommentArea;
