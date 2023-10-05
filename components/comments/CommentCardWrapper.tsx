import { ThemeType } from "@/interfaces/themeMaps";
import { CommentProvider } from "../contexts/CommentContext";
import CommentCardColumn from "./CommentCardColumn";
import CommentTypeBox from "./CommentTypeBox";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
}

const CommentCardWrapper: React.FC<Props> = ({ theme, resourceLocation }) => {
  return (
    <CommentProvider>
      <CommentTypeBox theme={theme} isExpanded={true} />
      <CommentCardColumn theme={theme} resourceLocation={resourceLocation} />
    </CommentProvider>
  );
};

export default CommentCardWrapper;
