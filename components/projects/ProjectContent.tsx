import parseCustomMarkdown from "@/lib/markdownParser";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  content: string;
};

const ProjectContent = ({ content }: Props) => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".regular-article-module pre code"
    );
    elements.forEach((element) => {
      hljs.highlightElement(element as HTMLElement);
    });
  }, []);

  return <section>{parseCustomMarkdown(content, "projects")}</section>;
};

export default ProjectContent;
