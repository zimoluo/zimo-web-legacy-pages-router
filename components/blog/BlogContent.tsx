import { useEffect } from "react";
import parseCustomMarkdown from "@/lib/markdownParser";
import { useSettings } from "../contexts/SettingsContext";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";

type Props = {
  content: string;
};

const BlogContent = ({ content }: Props) => {
  const { settings } = useSettings();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <section>
      {parseCustomMarkdown(content, "blog", !settings.disableSerifFont)}
    </section>
  );
};

export default BlogContent;
