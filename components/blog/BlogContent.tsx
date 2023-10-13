import parseCustomMarkdown from "@/lib/markdownParser";
import { useSettings } from "../contexts/SettingsContext";

type BlogContentProps = {
  content: string;
};

const BlogContent = ({ content }: BlogContentProps) => {
  const { settings } = useSettings();
  return (
    <section>
      {parseCustomMarkdown(content, "blog", !settings.disableSerifFont)}
    </section>
  );
};

export default BlogContent;
