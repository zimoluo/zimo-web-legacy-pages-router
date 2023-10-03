import {
  ThemeType,
  lightTextColorMap,
  likeButtonEmptySrc,
  likeButtonFilledSrc,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import CommentUser from "./CommentUser";
import { decryptSub, encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import ReplyCardColumn from "./ReplyCardColumn";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";
import {
  banOrUnbanUser,
  fetchComments,
  fetchUserDataBySecureSub,
  refreshUserState,
  uploadComments,
} from "@/lib/accountManager";
import Head from "next/head";
import ReplyTypeBox from "./ReplyTypeBox";
import { useReply } from "../contexts/ReplyContext";
import DeleteCommentButton from "./DeleteCommentButton";
import { enrichTextContent } from "@/lib/util";
import React from "react";

interface Props {
  theme: ThemeType;
  index: number;
}

const CommentCard: React.FC<Props> = ({ theme, index }) => {
  const { user, setUser } = useUser();
  const { comments, setComments, resourceLocation } = useComments();

  const { setReplyBoxContent } = useReply();

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const likeButtonEmptyImage =
    likeButtonEmptySrc[theme] || likeButtonEmptySrc["zimo"];
  const likeButtonFilledImage =
    likeButtonFilledSrc[theme] || likeButtonFilledSrc["zimo"];
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyBoxExpanded, setIsReplyBoxExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDelete(
        (decryptSub(user.secureSub) === comments![index].author &&
          user.state !== "banned") ||
          user.state === "admin"
      );
    }
  }, [user, comments]);

  const [authorUserState, setAuthorUserState] = useState<
    "normal" | "banned" | "admin" | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const data = (await fetchUserDataBySecureSub(
          encryptSub(comments![index].author),
          ["state"]
        )) as unknown as { state: "normal" | "banned" | "admin" };
        setAuthorUserState(data.state);
      } catch (error) {
        console.error("Error fetching user data by secure sub", error);
      }
    })();
  }, [comments, index, isBanning]);

  const shouldRevealFilled = useMemo(() => {
    if (!resourceLocation || !user || !comments || !comments[index]) {
      return false;
    }

    return comments[index].likedBy.includes(decryptSub(user.secureSub));
  }, [
    user,
    comments && comments[index] && comments[index].likedBy,
    resourceLocation,
  ]);

  const banButtonSrc =
    authorUserState === "banned" ? "/unban-user.svg" : "/ban-user.svg";

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: decryptSub(user?.secureSub),
    });

    setIsReplyBoxExpanded(!isReplyBoxExpanded);
  }

  async function evaluateBan() {
    if (isBanning || !user) return;

    const newUser = await refreshUserState(user, setUser);
    if (!(newUser.state === "admin")) return;

    setIsBanning(true);
    await banOrUnbanUser(encryptSub(comments![index].author));
    setIsBanning(false);
  }

  async function evaluateLike() {
    if (isLiking || !user || !resourceLocation) return;

    const newUser = await refreshUserState(user, setUser);

    if (newUser.state === "banned") return;

    setIsLiking(true);

    const decryptedSub = decryptSub(user.secureSub);

    // Temporarily update the client side for better user experience
    const temporaryComments = comments!.map((comment, i) => {
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
    setComments(temporaryComments);

    const downloadedComments = await fetchComments(resourceLocation);

    const updatedComments = downloadedComments!.map((comment, i) => {
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
    await uploadComments(resourceLocation!, updatedComments);
    setComments(updatedComments);

    setIsLiking(false);
  }

  async function deleteComment() {
    // Check if resourceLocation, user exists and user is not banned
    if (!resourceLocation || !user) return;

    const newUser = await refreshUserState(user, setUser);

    if (newUser.state === "banned") return;

    if (!comments || !comments[index]) return;

    const downloadedComments = await fetchComments(resourceLocation);

    // Check if the comment exists at the given index
    const targetComment = downloadedComments[index];
    if (!targetComment) return;

    // Check if the user has permission to delete this comment
    const decryptedSub = decryptSub(user.secureSub);
    if (targetComment.author !== decryptedSub && user.state !== "admin") return; // Ensure that the user is either the author or an admin

    // Check if the comment is the one we're looking for
    if (
      targetComment.author !== comments[index].author ||
      targetComment.content !== comments[index].content ||
      targetComment.date !== comments[index].date
    ) {
      return;
    }

    // Create updatedComments without the comment that needs to be deleted
    const updatedComments = downloadedComments.filter((_, i) => i !== index);

    // Update the state and upload the updated comments
    await uploadComments(resourceLocation, updatedComments);
    setComments(updatedComments);
  }

  return (
    <div className={`${index === 0 ? "" : "mt-8"}`}>
      <Head>
        <link rel="preload" as="image" href={likeButtonEmptyImage} />
        <link rel="preload" as="image" href={likeButtonFilledImage} />
      </Head>
      <CommentUser
        theme={theme}
        secureSub={encryptSub(comments![index].author)}
        date={comments![index].date}
      />
      <p className="text-lg mb-6 mt-2">
        {comments![index].content.split("\n").map((line, i, arr) => (
          <React.Fragment key={i}>
            {enrichTextContent(line)}
            {i === arr.length - 1 ? null : <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="flex items-center h-4 opacity-95">
        <div className="flex-grow" />
        {user &&
          user.state === "admin" &&
          (authorUserState === "normal" || authorUserState === "banned") && (
            <button
              onClick={evaluateBan}
              className={`mr-3.5 ${isBanning ? "cursor-wait" : ""}`}
            >
              <Image
                alt="Ban or Unban User"
                className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
                height={16}
                width={16}
                src={banButtonSrc}
                key={banButtonSrc}
              />
            </button>
          )}
        <DeleteCommentButton
          deleteComment={deleteComment}
          isShown={showDelete}
          theme={theme}
          isReply={false}
        />
        <button
          onClick={evaluateLike}
          className={`${isLiking ? "cursor-wait" : ""} relative group`}
        >
          <Image
            alt="Like Button"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 group-hover:scale-110`}
            height={16}
            width={16}
            src={likeButtonEmptyImage}
          />
          <Image
            alt="Like Button"
            aria-hidden={true}
            className={`h-4 w-auto aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute ${svgFilterClass} transform transition-all duration-300 group-hover:scale-110 ${
              shouldRevealFilled ? "opacity-100" : "opacity-0"
            }`}
            height={16}
            width={16}
            src={likeButtonFilledImage}
          />
        </button>
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].likedBy ? comments![index].likedBy.length : ""}
        </div>
        <button onClick={toggleReply} className="ml-4">
          <Image
            alt="Reply Button"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
            height={16}
            width={16}
            src="/reply-icon.svg"
          />
        </button>
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].replies ? comments![index].replies!.length : ""}
        </div>
        <button onClick={toggleExpanded} className="ml-4">
          <Image
            alt="Expand or Collapse Replies"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 ${
              isExpanded ? "-rotate-180" : "rotate-0"
            }`}
            height={16}
            width={16}
            src="/expand-collapse.svg"
          />
        </button>
      </div>
      <ReplyTypeBox
        theme={theme}
        isExpanded={isReplyBoxExpanded}
        commentIndex={index}
        setReplyExpanded={setIsExpanded}
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
