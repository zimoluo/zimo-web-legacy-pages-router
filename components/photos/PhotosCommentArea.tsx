import GeneralLikeButton from "../comments/GeneralLikeButton";
import CommentTypeBox from "../comments/CommentTypeBox";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useComments } from "../contexts/CommentContext";

type Props = {
  slug: string;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
};

const PhotosCommentArea = ({ slug, isExpanded, setIsExpanded }: Props) => {
  const { comments } = useComments();

  useEffect(() => {
    if (comments) {
      setIsExpanded(comments.length <= 1);
    }
  }, []);

  return (
    <div className="border-photos-comment border-orange-700 border-opacity-80 px-5 pt-4 py-1 bg-orange-50 bg-opacity-50 backdrop-blur-md">
      <div className="flex items-center">
        <GeneralLikeButton
          theme="photos"
          resourceLocation={`photos/likedBy/${slug}.json`}
        />
        <div className="flex-grow" />
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          <Image
            alt="Expand or Collapse Comment Card"
            className={`h-6 w-auto aspect-square transform transition-transform duration-300 hover:scale-110 ${
              isExpanded ? "rotate-0" : "-rotate-180"
            }`}
            height={24}
            width={24}
            src="/expand-collapse-photos.svg"
          />
        </button>
      </div>
      <CommentTypeBox theme="photos" isExpanded={isExpanded} />
    </div>
  );
};

export default PhotosCommentArea;
