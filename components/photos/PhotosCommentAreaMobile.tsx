import GeneralLikeButton from "../comments/GeneralLikeButton";
import CommentTypeBox from "../comments/CommentTypeBox";
import Image from "next/image";
import { useState } from "react";

type Props = {
  slug: string;
};

const PhotosCommentAreaMobile = ({ slug }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="mb-10 border-photos-comment-mobile border-orange-700 border-opacity-80 px-4 pt-4 bg-orange-50 bg-opacity-50 backdrop-blur-md">
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
              isExpanded ? "-rotate-180" : "rotate-0"
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

export default PhotosCommentAreaMobile;
