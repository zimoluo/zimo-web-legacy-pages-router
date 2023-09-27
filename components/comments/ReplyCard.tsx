import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import ReplyUser from "./ReplyUser";
import { decryptSub, encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import { useComments } from "../contexts/CommentContext";
import { useUser } from "../contexts/UserContext";
import { useReply } from "../contexts/ReplyContext";
import { useEffect, useState } from "react";
import { fetchComments, uploadComments } from "@/lib/accountManager";

interface Props {
  theme: ThemeType;
  index: number;
  commentIndex: number;
  setExpanded: (val: boolean) => void;
}

const ReplyCard: React.FC<Props> = ({
  theme,
  index,
  commentIndex,
  setExpanded,
}) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];

  const { user } = useUser();

  const { comments, resourceLocation, setComments } = useComments();

  const { setReplyBoxContent } = useReply();

  const repliesData = comments![commentIndex]!.replies![index];

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDelete(
        (decryptSub(user.secureSub) === repliesData.from &&
          user.state !== "banned") ||
          user.state === "admin"
      );
    }
  }, [user, repliesData.from]);

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: decryptSub(user?.secureSub),
      to: repliesData.from,
    });
    setExpanded(true);
  }

  async function deleteReply() {
    if (!resourceLocation || !user || user.state === "banned") return;

    const downloadedComments = await fetchComments(resourceLocation);

    // Check if the comment and reply exist at the given indexes
    const targetComment = downloadedComments[commentIndex];
    if (
      !targetComment ||
      !targetComment.replies ||
      !targetComment.replies[index]
    )
      return;

    const targetReply = targetComment.replies[index];

    // Decrypt user's secureSub to compare with the reply author
    const decryptedSub = decryptSub(user.secureSub);

    // Check if this is indeed the correct reply and if the user has the permission to delete it
    if (
      targetReply.from !== decryptedSub &&
      user.state !== "admin" // Ensure that the user is either the author or an admin
    ) {
      return; // The user doesn't have the permission to delete this reply
    }

    // Check if this is indeed the correct reply
    if (
      targetReply.from !== repliesData.from ||
      targetReply.content !== repliesData.content ||
      targetReply.date !== repliesData.date ||
      (targetReply.to ? targetReply.to !== repliesData.to : !!repliesData.to) // Check 'to' if it exists
    ) {
      return;
    }

    // Remove this specific reply and create a new updatedComment object
    const updatedComment = {
      ...targetComment,
      replies: targetComment.replies.filter((_, i) => i !== index),
    };

    // Replace the original comment with the updated one in downloadedComments
    const updatedComments = downloadedComments.map((comment, i) =>
      i === commentIndex ? updatedComment : comment
    );

    setComments(updatedComments);
    await uploadComments(resourceLocation!, updatedComments);
  }

  return (
    <div className="mt-6">
      <ReplyUser
        theme={theme}
        secureSub={encryptSub(repliesData.from)}
        date={repliesData.date}
        toSub={repliesData.to ? encryptSub(repliesData.to) : ""}
      />
      <p className="text-base mb-3 mt-1.5">{repliesData.content}</p>
      <div className="flex h-4">
        <div className="flex-grow" />
        {showDelete && (
          <button onClick={deleteReply} className="mr-4">
            <Image
              alt="Delete Comment"
              className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
              height={16}
              width={16}
              src="/delete-comment.svg"
            />
          </button>
        )}
        <button onClick={toggleReply}>
          <Image
            alt="Reply To This Person"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
            height={16}
            width={16}
            src="/reply-icon.svg"
          />
        </button>
      </div>
    </div>
  );
};

export default ReplyCard;
