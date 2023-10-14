import { useEffect } from "react";
import parseCustomMarkdown from "@/lib/markdownParser";
import { useSettings } from "../contexts/SettingsContext";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

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
      hljs.highlightElement(element as HTMLElement);
    });
  }, []);

  return (
    <section>
      {parseCustomMarkdown(content, "blog", !settings.disableSerifFont)}
    </section>
  );
};

export default BlogContent;
