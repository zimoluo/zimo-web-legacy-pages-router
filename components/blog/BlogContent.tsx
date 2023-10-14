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
    const elements = document.querySelectorAll(
      ".regular-article-module pre code"
    );
    elements.forEach((element) => {
      Prism.highlightElement(element);
    });
  }, []);

  return (
    <section>
      {parseCustomMarkdown(content, "blog", !settings.disableSerifFont)}
    </section>
  );
};

export default BlogContent;
