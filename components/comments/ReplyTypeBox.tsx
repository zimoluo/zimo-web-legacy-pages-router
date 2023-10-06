import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ThemeType,
  borderColorMap,
  placeholderTextColorMap,
  sliderButtonColorMap,
  svgFilterMap,
} from "@/interfaces/themeMaps";
import { useComments } from "../contexts/CommentContext";
import Image from "next/image";
import { addReply, fetchUserDataBySub } from "@/lib/accountClientManager";
import { useReply } from "../contexts/ReplyContext";
import { useUser } from "../contexts/UserContext";

interface Props {
  theme: ThemeType;
  isExpanded: boolean;
  commentIndex: number;
  setReplyExpanded: Dispatch<SetStateAction<boolean>>;
}

const ReplyTypeBox: React.FC<Props> = ({
  theme,
  isExpanded,
  commentIndex,
  setReplyExpanded,
}) => {
  const { comments, setComments, resourceLocation } = useComments();
  const { user } = useUser();
  const { replyBoxContent } = useReply();
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const typeBoxColorClass =
    sliderButtonColorMap[theme] || sliderButtonColorMap["zimo"];
  const placeholderTextColorClass =
    placeholderTextColorMap[theme] || placeholderTextColorMap["zimo"];
  const borderColorClass = borderColorMap[theme] || borderColorMap["zimo"];

  const [inputValue, setInputValue] = useState("");

  const [placeholderName, setPlaceholderName] = useState("");

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user) {
      setPlaceholderName("Sign in to leave a comment.");
      return;
    }
    if (user && user.state === "banned") {
      setPlaceholderName("You are banned. Please contact admin.");
      return;
    }

    const fetchPlaceholderName = async () => {
      try {
        let targetSub: string | null = null;

        if (replyBoxContent?.to) {
          targetSub = replyBoxContent.to;
        } else if (
          comments &&
          typeof commentIndex === "number" &&
          comments[commentIndex]
        ) {
          targetSub = comments[commentIndex].author;
        }

        if (targetSub) {
          let name;

          const fetchedUserData = await fetchUserDataBySub(targetSub, ["name"]);
          name = fetchedUserData.name;

          setPlaceholderName(`Reply to ${name}...`);
        } else {
          setPlaceholderName("Reply to...");
        }
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    };
    fetchPlaceholderName();
  }, [replyBoxContent, comments, commentIndex, user]);

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

  async function sendReply() {
    if (isSending || !user || user.state === "banned") return;

    if (
      !comments ||
      !replyBoxContent ||
      !resourceLocation ||
      !inputValue.trim()
    )
      return;

    setIsSending(true);

    try {
      // Construct the new reply
      const newReply = {
        from: replyBoxContent.from,
        date: new Date().toISOString(),
        content: inputValue,
        ...(replyBoxContent.to && { to: replyBoxContent.to }), // if to does not exist then don’t have it.
      };

      const updatedComments = await addReply(
        resourceLocation!,
        newReply,
        commentIndex
      );
      setComments(updatedComments);
      setInputValue("");
      setReplyExpanded(true);
    } catch (error) {
      console.error("Error sending comment", error);
    } finally {
      setIsSending(false); // Reset isSending whether there is an error or success
    }
  }

  return (
    <div style={columnStyle} ref={columnRef} className="pl-6 pr-3 relative">
      <textarea
        className={`w-full px-3 py-2 h-24 my-1.5 rounded-xl shadow-sm ${typeBoxColorClass} ${borderColorClass} border-menu-rule border-opacity-20 bg-opacity-40 backdrop-blur-md resize-none text-sm ${
          isSending ? "cursor-wait" : ""
        } ${placeholderTextColorClass} placeholder:opacity-50`}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholderName}
        disabled={!user || user.state === "banned" || isSending}
      />
      {user && user.state !== "banned" && (
        <button onClick={sendReply} className="z-10">
          <Image
            src="/send-comment.svg"
            className={`h-4 absolute w-auto aspect-square bottom-4 right-5 opacity-80 cursor-pointer transform transition-transform duration-300 hover:scale-110 ${svgFilterClass} ${
              isSending ? "cursor-wait" : ""
            }`}
            height={16}
            width={16}
            alt="Send Reply"
          />
        </button>
      )}
    </div>
  );
};

export default ReplyTypeBox;
