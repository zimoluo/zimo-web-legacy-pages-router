import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import ReplyUser from "./ReplyUser";
import { encryptSub } from "@/lib/encryptSub";
import Image from "next/image";
import { useComments } from "../contexts/CommentContext";

interface Props {
  theme: ThemeType;
  index: number;
  commentIndex: number;
}

const ReplyCard: React.FC<Props> = ({ theme, index, commentIndex }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const { comments } = useComments();

  const repliesData = comments![commentIndex]!.replies![index];

  return (
    <div className="mt-6">
      <ReplyUser
        theme={theme}
        secureSub={encryptSub(repliesData.from)}
        date={repliesData.date}
        toSub={repliesData.to ? encryptSub(repliesData.to) : ""}
      />
      <p className="text-base my-3">{repliesData.content}</p>
      <div className="flex h-4">
        <div className="flex-grow" />
        <Image
          alt="Reply Button"
          className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 cursor-pointer`}
          height={16}
          width={16}
          src="/reply-icon.svg"
        />
      </div>
    </div>
  );
};

export default ReplyCard;
