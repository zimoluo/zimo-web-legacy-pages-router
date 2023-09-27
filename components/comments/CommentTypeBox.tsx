import React, { useEffect, useRef, useState } from "react";
import {
  ThemeType,
  borderColorMap,
  placeholderTextColorMap,
  sliderButtonColorMap,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import { useComments } from "../contexts/CommentContext";
import Image from "next/image";
import { fetchComments, uploadComments } from "@/lib/accountManager";
import { useUser } from "../contexts/UserContext";
import { decryptSub } from "@/lib/encryptSub";

interface Props {
  theme: ThemeType;
  isExpanded: boolean;
}

const CommentTypeBox: React.FC<Props> = ({
  theme,
  isExpanded,
}) => {
  const { comments, setComments, resourceLocation } = useComments();
  const { user } = useUser();
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const typeBoxColorClass =
    sliderButtonColorMap[theme] || sliderButtonColorMap["zimo"];
  const placeholderTextColorClass =
    placeholderTextColorMap[theme] || placeholderTextColorMap["zimo"];
  const borderColorClass = borderColorMap[theme] || borderColorMap["zimo"];

  const [inputValue, setInputValue] = useState("");

  const [placeholderName, setPlaceholderName] = useState("");

  useEffect(() => {
    if (!user) {
      setPlaceholderName("You are not logged in.");
      return;
    }
    if (user && user.state === "banned") {
      setPlaceholderName("You are banned. Please contact admin.");
      return;
    }

    setPlaceholderName("Leave a comment...");
  }, [user]);

  useEffect(() => {
    if (!user || user.state === "banned") {
      setInputValue(""); // Clear the text area content
    }
  }, [user]);

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
    marginTop: "0.75rem",
    marginBottom: "0.3rem",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  async function sendComment() {
    if (!user || !comments || !resourceLocation || user.state === "banned")
      return;

    const downloadedComments = await fetchComments(resourceLocation);

    // If inputValue has only whitespaces (various kinds of spaces, not just standard one) then return.
    if (!inputValue.trim()) return;

    // Construct the new comment
    const newComment = {
      author: decryptSub(user.secureSub), //assuming the user object has a name property representing the author's name
      date: new Date().toISOString(),
      content: inputValue,
      likedBy: [], // initially, no one has liked the comment
      replies: [],
    };

    // Append it to the comments array
    const updatedComments = [...downloadedComments, newComment];

    setComments(updatedComments); // Update the local state
    await uploadComments(resourceLocation, updatedComments); // Update the remote data
    setInputValue(""); // Reset the input value
  }

  return (
    <div style={columnStyle} ref={columnRef} className="px-3 relative">
      <textarea
        className={`w-full px-3 py-2 h-32 my-1.5 rounded-xl shadow-sm ${typeBoxColorClass} ${borderColorClass} border-menu-rule border-opacity-20 bg-opacity-40 backdrop-blur-md resize-none text-base ${placeholderTextColorClass} placeholder:opacity-50`}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholderName}
        disabled={!user || user.state === "banned"}
      />
      {user && user.state !== "banned" && (
        <button onClick={sendComment}>
          <Image
            src="/send-comment.svg"
            className={`h-4 absolute w-auto aspect-square bottom-4 right-5 opacity-80 cursor-pointer transform transition-transform duration-300 hover:scale-110 ${svgFilterClass}`}
            height={16}
            width={16}
            alt="Send Comment"
          />
        </button>
      )}
    </div>
  );
};

export default CommentTypeBox;
