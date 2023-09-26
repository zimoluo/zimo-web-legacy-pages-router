import React, { useEffect } from "react";
import { ThemeType } from "@/interfaces/themeMaps";
import CommentCard from "./CommentCard";
import { useComments } from "../contexts/CommentContext";

interface Props {
  theme: ThemeType;
  comments: CommentEntry[];
}

const CommentCardColumn: React.FC<Props> = ({ theme, comments }) => {
  const { setComments, comments: contextComments } = useComments();

  useEffect(() => {
    if (comments && comments.length > 0) {
      setComments(comments);
    }
  }, [comments, setComments]);

  return (
    <div className="border-black border-2">
      {contextComments &&
        comments.map((comment, index) => (
          <CommentCard key={index} index={index} theme={theme} />
        ))}
    </div>
  );
};

export default CommentCardColumn;
