import { ThemeType } from "@/interfaces/themeMaps";
import { CommentProvider, useComments } from "../contexts/CommentContext";
import CommentCardColumn from "./CommentCardColumn";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
}

const CommentCardWrapper: React.FC<Props> = ({ theme, resourceLocation }) => {
  return (
    <CommentProvider>
      <CommentCardColumn theme={theme} resourceLocation={resourceLocation} />
    </CommentProvider>
  );
};

export default CommentCardWrapper;
