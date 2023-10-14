import { useEffect } from "react";
import parseCustomMarkdown from "@/lib/markdownParser";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  content: string;
  isIndex?: boolean;
};

const AboutContent = ({ content, isIndex = false }: Props) => {
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
      {parseCustomMarkdown(content, isIndex ? "zimo" : "about")}
    </section>
  );
};

export default AboutContent;
