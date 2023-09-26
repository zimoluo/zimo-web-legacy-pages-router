import {
  ThemeType,
  lightTextColorMap,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import CommentUser from "./CommentUser";
import { decryptSub, encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import ReplyCardColumn from "./ReplyCardColumn";
import { useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";
import { uploadComments } from "@/lib/accountManager";
import Head from "next/head";
import ReplyTypeBox from "./ReplyTypeBox";
import { useReply } from "../contexts/ReplyContext";

interface Props {
  theme: ThemeType;
  index: number;
}

const CommentCard: React.FC<Props> = ({ theme, index }) => {
  const { user } = useUser();
  const { comments, setComments, resourceLocation } = useComments();

  const { setReplyBoxContent, replyBoxContent } = useReply();

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyBoxExpanded, setIsReplyBoxExpanded] = useState(false);

  const likeButtonSrc = useMemo(() => {
    if (!resourceLocation || !user || !comments || !comments[index]) {
      return theme === "photos" ? "/heart-icon.svg" : "/thumbs-up.svg";
    }

    return comments[index].likedBy.includes(decryptSub(user.secureSub))
      ? theme === "photos"
        ? "/heart-icon-filled.svg"
        : "/thumbs-up-filled.svg"
      : theme === "photos"
      ? "/heart-icon.svg"
      : "/thumbs-up.svg";
  }, [
    theme,
    user,
    comments && comments[index] && comments[index].likedBy,
    resourceLocation,
  ]);

  function toggleExpanded() {
    if (!comments![index].replies) {
      setIsExpanded(false);
      return;
    }
    if (isExpanded) {
      setIsReplyBoxExpanded(false);
    }
    setIsExpanded(!isExpanded);
  }

  function toggleReply() {
    if (!isReplyBoxExpanded) {
      setIsExpanded(true);
    }
    if (!user) return;

    setReplyBoxContent({
      from: decryptSub(user?.secureSub),
      content: replyBoxContent?.content ? replyBoxContent.content : "",
    });

    setIsReplyBoxExpanded(!isReplyBoxExpanded);
  }

  function evaluateLike() {
    if (!user) return;

    const decryptedSub = decryptSub(user.secureSub);
    const updatedComments = comments!.map((comment, i) => {
      if (i !== index) return comment; // Skip if it's not the comment we want to modify

      if (comment.likedBy.includes(decryptedSub)) {
        // Return a new comment object with the decryptedSub removed from the likedBy array
        return {
          ...comment,
          likedBy: comment.likedBy.filter((sub) => sub !== decryptedSub),
        };
      } else {
        // Return a new comment object with the decryptedSub added to the likedBy array
        return {
          ...comment,
          likedBy: [...comment.likedBy, decryptedSub],
        };
      }
    });

    // Now, update the state
    setComments(updatedComments);
    uploadComments(resourceLocation!, updatedComments);
  }

  return (
    <div className={`${index === 0 ? "" : "mt-8"}`}>
      <Head>
        <link rel="preload" as="image" href="/heart-icon.svg" />
        <link rel="preload" as="image" href="/thumbs-up.svg" />
        <link rel="preload" as="image" href="/heart-icon-filled.svg" />
        <link rel="preload" as="image" href="/thumbs-up-filled.svg" />
      </Head>
      <CommentUser
        theme={theme}
        secureSub={encryptSub(comments![index].author)}
        date={comments![index].date}
      />
      <p className="text-lg mb-6 mt-2">{comments![index].content}</p>
      <div className="flex items-center h-4 opacity-95">
        <div className="flex-grow" />
        <Image
          alt="Like Button"
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 cursor-pointer`}
          height={16}
          width={16}
          src={likeButtonSrc}
          key={likeButtonSrc}
          onClick={evaluateLike}
        />
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].likedBy ? comments![index].likedBy.length : ""}
        </div>
        <Image
          alt="Reply Button"
          className={`h-4 w-auto aspect-square ml-4 ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 cursor-pointer`}
          height={16}
          width={16}
          onClick={toggleReply}
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
      <ReplyTypeBox
        theme={theme}
        isExpanded={isReplyBoxExpanded}
        commentIndex={index}
      />
      {comments![index].replies && (
        <ReplyCardColumn
          theme={theme}
          isExpanded={isExpanded}
          commentIndex={index}
          setExpanded={setIsReplyBoxExpanded}
        />
      )}
    </div>
  );
};

export default CommentCard;
