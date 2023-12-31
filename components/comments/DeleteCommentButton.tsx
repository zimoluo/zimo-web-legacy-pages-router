import {
  ThemeType,
  menuEntryBorderMap,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";

interface Props {
  theme: ThemeType;
  isShown: boolean;
  deleteComment: () => void;
  isReply?: boolean;
}

const DeleteCommentButton: React.FC<Props> = ({
  theme,
  isShown,
  deleteComment,
  isReply = false,
}) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const borderColorClass = menuEntryBorderMap[theme];

  const [showMore, setShowMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  async function evaluateDelete() {
    if (isDeleting || !showMore) return;
    setIsDeleting(true);
    setShowMore(false);
    await deleteComment();
    setIsDeleting(false);
  }

  function evaluateGarbageCan() {
    if (isDeleting) return;
    setShowMore(!showMore);
  }

  const divStyle = {
    overflow: "hidden",
    width: showMore ? "3.08rem" : "1.5rem", // Replace minWidth with the actual min-width
    transition: "width 0.2s ease-in-out",
  };

  if (!isShown) return null;

  return (
    <div
      ref={divRef}
      style={divStyle}
      className={`relative mr-3 h-6 flex items-center rounded-md border-menu-entry ${borderColorClass} ${
        showMore ? "border-opacity-60" : "border-opacity-0"
      } justify-end`}
    >
      <Head>
        <link rel="preload" as="image" href="/confirm-delete.svg" />
        <link rel="preload" as="image" href="/delete-comment.svg" />
      </Head>
      <button onClick={evaluateDelete} className="absolute right-7">
        <Image
          alt="Confirm Delete"
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
          height={16}
          width={16}
          src="/confirm-delete.svg"
        />
      </button>
      <div
        className={`h-4 w-0 ${borderColorClass} border-menu-rule border-opacity-60 absolute right-6`}
      />
      <button
        onClick={evaluateGarbageCan}
        className={`absolute right-1 ${isDeleting ? "cursor-wait" : ""}`}
        disabled={isDeleting}
      >
        <Image
          alt={`Delete ${isReply ? "Reply" : "Comment"}`}
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
          height={16}
          width={16}
          src="/delete-comment.svg"
        />
      </button>
    </div>
  );
};

export default DeleteCommentButton;
