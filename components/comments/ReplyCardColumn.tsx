import React, { useRef, useEffect, useState } from "react";
import ReplyCard from "./ReplyCard";
import { ThemeType } from "@/interfaces/themeMaps";
import { useComments } from "../contexts/CommentContext";

interface Props {
  theme: ThemeType;
  isExpanded: boolean;
  commentIndex: number;
  setExpanded: (val: boolean) => void;
}

const ReplyCardColumn: React.FC<Props> = ({
  theme,
  isExpanded,
  commentIndex,
  setExpanded,
}) => {
  const { comments } = useComments();

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (columnRef.current) {
      const height = columnRef.current.scrollHeight;
      setMaxHeight(`${height}px`);
    }
  }, [comments![commentIndex].replies]);

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isExpanded ? maxHeight : "0px",
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div style={columnStyle} ref={columnRef} className="pl-6">
      {comments![commentIndex].replies!.map((reply, index) => (
        <ReplyCard key={index} index={index} theme={theme} commentIndex={commentIndex} setExpanded={setExpanded} />
      ))}
    </div>
  );
};

export default ReplyCardColumn;
