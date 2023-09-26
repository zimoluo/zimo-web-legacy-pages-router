import { ThemeType } from "@/interfaces/themeMaps";
import { CommentProvider, useComments } from "../contexts/CommentContext";
import CommentCardColumn from "./CommentCardColumn";

interface Props {
  comments: CommentEntry[];
  theme: ThemeType;
}

const CommentCardWrapper: React.FC<Props> = ({ comments, theme }) => {
  return (
    <CommentProvider>
      <CommentCardColumn theme={theme} comments={comments} />
    </CommentProvider>
  );
};

export default CommentCardWrapper;
