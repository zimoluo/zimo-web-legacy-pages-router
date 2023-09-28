import {
  ThemeType,
  lightTextColorMap,
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
  uploadComments,
} from "@/lib/accountManager";
import Head from "next/head";
import ReplyTypeBox from "./ReplyTypeBox";
import { useReply } from "../contexts/ReplyContext";
import DeleteCommentButton from "./DeleteCommentButton";
import safeMarkdownToHtml from "@/lib/util";

interface Props {
  theme: ThemeType;
  index: number;
}

const CommentCard: React.FC<Props> = ({ theme, index }) => {
  const { user } = useUser();
  const { comments, setComments, resourceLocation } = useComments();

  const { setReplyBoxContent } = useReply();

  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyBoxExpanded, setIsReplyBoxExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const doConversion = async () => {
      try {
        const html = await safeMarkdownToHtml(comments![index].content); // Perform the async conversion
        setHtmlContent(html); // Set the converted HTML
      } catch (error) {
        console.error("Error converting markdown to HTML", error);
        setHtmlContent("Error loading content..."); // Set some default error message
      }
    };

    if (comments && comments[index]) {
      doConversion(); // Execute the conversion when component mounts/updates
    }
  }, [comments, index]);

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

    if (
      (!comments![index].replies || comments![index].replies!.length === 0) &&
      isReplyBoxExpanded
    ) {
      setIsExpanded(false);
    }

    setIsReplyBoxExpanded(!isReplyBoxExpanded);
  }

  async function evaluateBan() {
    if (isBanning || !user || user.state !== "admin") return;
    setIsBanning(true);
    await banOrUnbanUser(encryptSub(comments![index].author));
    setIsBanning(false);
  }

  async function evaluateLike() {
    if (isLiking || !user || !resourceLocation || user.state === "banned")
      return;

    setIsLiking(true);

    const downloadedComments = await fetchComments(resourceLocation);

    const decryptedSub = decryptSub(user.secureSub);
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
    if (!resourceLocation || !user || user.state === "banned") return;

    const downloadedComments = await fetchComments(resourceLocation);

    // Check if the comment exists at the given index
    const targetComment = downloadedComments[index];
    if (!targetComment) return;

    // Check if the user has permission to delete this comment
    const decryptedSub = decryptSub(user.secureSub);
    if (targetComment.author !== decryptedSub && user.state !== "admin") return; // Ensure that the user is either the author or an admin

    // Create updatedComments without the comment that needs to be deleted
    const updatedComments = downloadedComments.filter((_, i) => i !== index);

    // Update the state and upload the updated comments
    setComments(updatedComments);
    await uploadComments(resourceLocation, updatedComments);
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
      <p className="text-lg mb-6 mt-2">
        {comments![index].content.split("\n").map((line, i, arr) =>
          i === arr.length - 1 ? (
            line
          ) : (
            <>
              {line}
              <br />
            </>
          )
        )}
      </p>
      <div className="flex items-center h-4 opacity-95">
        <div className="flex-grow" />
        {user &&
          user.state === "admin" &&
          (authorUserState === "normal" || authorUserState === "banned") && (
            <button
              onClick={evaluateBan}
              className={`${isBanning ? "cursor-wait" : ""}`}
            >
              <Image
                alt="Ban or Unban User"
                className={`h-4 mr-3.5 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
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
          className={`${isLiking ? "cursor-wait" : ""}`}
        >
          <Image
            alt="Like Button"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
            height={16}
            width={16}
            src={likeButtonSrc}
            key={likeButtonSrc}
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
