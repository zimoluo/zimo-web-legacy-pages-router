import parseCustomMarkdown from "@/lib/markdownParser";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { useEffect } from "react";

type Props = {
  content: string;
};

const ProjectContent = ({ content }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return <section>{parseCustomMarkdown(content, "projects")}</section>;
};

export default ProjectContent;
