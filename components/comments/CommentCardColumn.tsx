import React, { useEffect } from "react";
import { ThemeType } from "@/interfaces/themeMaps";
import CommentCard from "./CommentCard";
import { useComments } from "../contexts/CommentContext";
import { fetchComments } from "@/lib/accountManager";
import { ReplyProvider } from "../contexts/ReplyContext";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
}

const CommentCardColumn: React.FC<Props> = ({ theme, resourceLocation }) => {
  const {
    setComments,
    comments: contextComments,
    setResourceLocation,
  } = useComments();

  useEffect(() => {
    setResourceLocation(resourceLocation);
  }, [resourceLocation]);

  useEffect(() => {
    const fetchAndSetComments = async () => {
      const comments = await fetchComments(resourceLocation);
      if (comments && comments.length > 0) {
        setComments(comments);
      }
    };
    fetchAndSetComments();
  }, []);

  return (
    <div className="border-black border-2">
      {contextComments &&
        contextComments.map((comment, index) => (
          <ReplyProvider key={index}>
            <CommentCard index={index} theme={theme} />
          </ReplyProvider>
        ))}
    </div>
  );
};

export default CommentCardColumn;
