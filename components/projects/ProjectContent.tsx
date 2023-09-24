import markdownStyles from "./projects-markdown-styles.module.css";
import generalMarkdownStyles from "../general-text-markdown.module.css";

type Props = {
  content: string;
};

const ProjectContent = ({ content }: Props) => {
  return (
    <div
      className={`${generalMarkdownStyles["markdown"]} ${markdownStyles["markdown"]}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ProjectContent;
