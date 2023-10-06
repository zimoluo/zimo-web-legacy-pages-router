import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import ReplyUser from "./ReplyUser";
import Image from "next/image";
import { useComments } from "../contexts/CommentContext";
import { useUser } from "../contexts/UserContext";
import { useReply } from "../contexts/ReplyContext";
import { useEffect, useState } from "react";
import {
  banOrUnbanUser,
  deleteReply,
  fetchUserDataBySub,
} from "@/lib/accountClientManager";
import DeleteCommentButton from "./DeleteCommentButton";
import React from "react";
import { enrichTextContent } from "@/lib/util";

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

  const [isBanning, setIsBanning] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDelete(
        (user.sub === repliesData.from && user.state !== "banned") ||
          user.state === "admin"
      );
    }
  }, [user, repliesData.from]);

  const [authorUserState, setAuthorUserState] = useState<UserState | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        let userData;

        userData = await fetchUserDataBySub(repliesData.from, ["state"]);

        if (userData === null) {
          throw new Error("Failed to fetch user data.");
        }

        setAuthorUserState(userData.state);
      } catch (error) {
        console.error("Error fetching user data by sub", error);
      }
    })();
  }, [repliesData, isBanning]);

  const banButtonSrc =
    authorUserState === "banned" ? "/unban-user.svg" : "/ban-user.svg";

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: user?.sub,
      to: repliesData.from,
    });
    setExpanded(true);
  }

  async function evaluateBan() {
    if (isBanning || !user || user.state !== "admin") return;

    setIsBanning(true);
    await banOrUnbanUser(repliesData.from);
    setIsBanning(false);
  }

  async function evaluateDeleteReply() {
    if (!resourceLocation || !user || user.state === "banned") return;

    const updatedComments = await deleteReply(
      resourceLocation,
      commentIndex,
      index,
      repliesData
    );

    setComments(updatedComments);
  }

  return (
    <div className="mt-6">
      <ReplyUser
        theme={theme}
        sub={repliesData.from}
        date={repliesData.date}
        toSub={repliesData.to ? repliesData.to : ""}
      />
      <p className="text-base mb-3 mt-1.5">
        {repliesData.content.split("\n").map((line, i, arr) => (
          <React.Fragment key={i}>
            {enrichTextContent(line)}
            {i === arr.length - 1 ? null : <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="flex h-4 items-center mb-1.5">
        <div className="flex-grow" />
        {user &&
          user.state === "admin" &&
          (authorUserState === "normal" || authorUserState === "banned") && (
            <button
              onClick={evaluateBan}
              className={`mr-3 ${isBanning ? "cursor-wait" : ""}`}
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
          deleteComment={evaluateDeleteReply}
          isShown={showDelete}
          theme={theme}
          isReply={true}
        />
        <button onClick={toggleReply} className="mr-0.5">
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
