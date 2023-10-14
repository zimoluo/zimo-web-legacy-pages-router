import parseCustomMarkdown from "@/lib/markdownParser";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { useEffect } from "react";

type Props = {
  content: string;
};

const ProjectContent = ({ content }: Props) => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".regular-article-module pre code"
    );
    elements.forEach((element) => {
      Prism.highlightElement(element);
    });
  }, []);

  return <section>{parseCustomMarkdown(content, "projects")}</section>;
};

export default ProjectContent;
