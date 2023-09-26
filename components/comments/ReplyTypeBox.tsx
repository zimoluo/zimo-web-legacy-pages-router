import React, { useEffect, useRef, useState } from "react";
import {
  ThemeType,
  placeholderTextColorMap,
  sliderButtonColorMap,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import { useComments } from "../contexts/CommentContext";
import Image from "next/image";
import { fetchUserNameBySecureSub, uploadComments } from "@/lib/accountManager";
import { encryptSub } from "@/lib/encryptSub";
import { useReply } from "../contexts/ReplyContext";
import { useUser } from "../contexts/UserContext";

interface Props {
  theme: ThemeType;
  isExpanded: boolean;
  commentIndex: number;
}

const ReplyTypeBox: React.FC<Props> = ({ theme, isExpanded, commentIndex }) => {
  const { comments, setComments, resourceLocation } = useComments();
  const { user } = useUser();
  const { replyBoxContent } = useReply();
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const typeBoxColorClass =
    sliderButtonColorMap[theme] || sliderButtonColorMap["zimo"];
  const placeholderTextColorClass =
    placeholderTextColorMap[theme] || placeholderTextColorMap["zimo"];

  const [inputValue, setInputValue] = useState("");

  const [placeholderName, setPlaceholderName] = useState("");

  useEffect(() => {
    const fetchPlaceholderName = async () => {
      try {
        let name;
        if (replyBoxContent?.to) {
          name = await fetchUserNameBySecureSub(encryptSub(replyBoxContent.to));
        } else if (comments && comments[commentIndex]) {
          name = await fetchUserNameBySecureSub(
            encryptSub(comments[commentIndex]!.author)
          );
        }
        setPlaceholderName(name || "");
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    };
    fetchPlaceholderName();
  }, [replyBoxContent, comments, commentIndex]);

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (columnRef.current) {
      const height = columnRef.current.scrollHeight;
      setMaxHeight(`${height}px`);
    }
  }, [inputValue]);

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isExpanded ? maxHeight : "0px",
    transition: "max-height 0.3s ease-in-out",
    marginTop: "1rem",
    marginBottom: "0.6rem",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  function sendReply() {
    if (!user || !comments || !replyBoxContent) return;

    // If inputValue has only whitespaces (various kinds of spaces, not just standard one) then return.
    if (!inputValue.trim()) return;

    // Construct the new reply
    const newReply = {
      from: replyBoxContent.from,
      date: new Date().toISOString(),
      content: inputValue,
      ...(replyBoxContent.to && { to: replyBoxContent.to }), // if to does not exist then don’t have it.
    };

    // Update the comments array
    const updatedComments = comments.map((comment, i) => {
      if (i !== commentIndex) return comment; // Skip if it's not the comment we want to modify

      // Initialize replies array if it does not exist
      const replies = comment.replies || [];

      // Return a new comment object with the new reply appended to the replies array
      return {
        ...comment,
        replies: [...replies, newReply],
      };
    });

    setComments(updatedComments);
    uploadComments(resourceLocation!, updatedComments);
    setInputValue("");
  }

  return (
    <div style={columnStyle} ref={columnRef} className="px-3 relative">
      <textarea
        className={`w-full px-3 py-2 h-24 rounded-xl ${typeBoxColorClass} bg-opacity-40 backdrop-blur-md resize-none text-sm ${placeholderTextColorClass} placeholder:opacity-50`}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={`Reply to ${placeholderName}...`}
      />
      <Image
        src="/send-comment.svg"
        className={`h-4 absolute w-auto aspect-square bottom-3 right-5 opacity-80 cursor-pointer transform transition-transform duration-300 hover:scale-110 ${svgFilterClass}`}
        height={16}
        width={16}
        alt="Send Reply"
        onClick={sendReply}
      />
    </div>
  );
};

export default ReplyTypeBox;
