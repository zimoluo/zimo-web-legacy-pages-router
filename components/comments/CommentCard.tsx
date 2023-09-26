import {
    ThemeType,
    lightTextColorMap,
    svgFilterMap,
} from "@/interfaces/themeMaps";
import CommentUser from "./CommentUser";
import { decryptSub, encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import ReplyCardColumn from "./ReplyCardColumn";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";

interface Props {
  theme: ThemeType;
  index: number;
}

const CommentCard: React.FC<Props> = ({ theme, index }) => {
  const { user } = useUser();
  const { comments } = useComments();
  
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const [isExpanded, setIsExpanded] = useState(false);

  let likeButtonSrc = "/thumbs-up.svg";
  if (theme === "photos") {
    likeButtonSrc = "/heart-icon.svg";
  }

  if (user && comments![index].likedBy.includes(decryptSub(user.secureSub))) {
    if (theme === "photos") {
      likeButtonSrc = "/heart-icon-filled.svg";
    } else {
      likeButtonSrc = "/thumbs-up-filled.svg";
    }
  }

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={`${index === 0 ? "" : "mt-8"}`}>
      <CommentUser
        theme={theme}
        secureSub={encryptSub(comments![index].author)}
        date={comments![index].date}
      />
      <p className="text-lg my-6">{comments![index].content}</p>
      <div className="flex items-center h-4 opacity-95">
        <div className="flex-grow" />
        <Image
          alt="Like Button"
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
          height={16}
          width={16}
          src={likeButtonSrc}
        />
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].likedBy ? comments![index].likedBy.length : ""}
        </div>
        <Image
          alt="Reply Button"
          className={`h-4 w-auto aspect-square ml-4 ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
          height={16}
          width={16}
          src="/reply-icon.svg"
        />
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].replies ? comments![index].replies!.length : ""}
        </div>
        <Image
          alt="Expand or Collapse Replies"
          className={`h-4 w-auto aspect-square ml-4 ${svgFilterClass} transform cursor-pointer transition-transform duration-300 hover:scale-110 ${
            isExpanded ? "-rotate-180" : "rotate-0"
          }`}
          height={16}
          width={16}
          src="/expand-collapse.svg"
          onClick={toggleExpanded}
        />
      </div>
      {comments![index].replies && (
        <ReplyCardColumn
          theme={theme}
          isExpanded={isExpanded}
          commentIndex={index}
        />
      )}
    </div>
  );
};

export default CommentCard;
