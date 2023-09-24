import { useSettings } from "../contexts/SettingsContext";
import markdownStyles from "./blog-markdown-styles.module.css";
import generalMarkdownStyles from "../general-text-markdown.module.css";

type BlogContentProps = {
  content: string;
};

const BlogContent = ({ content }: BlogContentProps) => {
  const { settings } = useSettings();

  return (
    <div
      className={`${generalMarkdownStyles["markdown"]} ${
        markdownStyles["markdown"]
      } ${!settings.disableSerifFont ? generalMarkdownStyles["markdown-serif"] : ""}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
