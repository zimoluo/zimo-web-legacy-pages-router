import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import ReplyUser from "./ReplyUser";
import { decryptSub, encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import { useComments } from "../contexts/CommentContext";
import { useUser } from "../contexts/UserContext";
import { useReply } from "../contexts/ReplyContext";

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

  const { comments } = useComments();

  const { setReplyBoxContent, replyBoxContent } = useReply();

  const repliesData = comments![commentIndex]!.replies![index];

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: decryptSub(user?.secureSub),
      to: repliesData.from,
      content: replyBoxContent?.content ? replyBoxContent.content : "",
    });
    setExpanded(true);
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
        <Image
          alt="Reply Button"
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 cursor-pointer`}
          height={16}
          width={16}
          src="/reply-icon.svg"
          onClick={toggleReply}
        />
      </div>
    </div>
  );
};

export default ReplyCard;
