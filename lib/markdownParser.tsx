import ImageViewer from "@/components/ImageViewer";
import MusicPlayerCard from "@/components/MusicPlayerCard";
import React from "react";
import { ReactNode } from "react";
import { marked } from "marked";

const componentsMap: { [key: string]: React.FC<any> } = {
  ImageViewer,
  MusicPlayerCard,
  // Add more custom components here as needed
};

const parseProps = (input: string): { [key: string]: any } => {
  const props: { [key: string]: any } = {};
  const regex = /(\w+)=\{?\[?"?(.*?)"?\]?\}?/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    props[match[1]] = match[2];
  }
  return props;
};

const parseXmlLikeSyntax = (input: string): ReactNode => {
  const regex = /<(\w+)([^>]*?)(\/>|><\/\1>)/g;
  const results = Array.from(input.matchAll(regex));

  return results.map((result, idx) => {
    const [fullMatch, componentName, propString] = result;
    const component = componentsMap[componentName];

    if (!component) {
      throw new Error(`Unknown component: ${componentName}`);
    }

    const props = parseProps(propString);

    return React.createElement(component, { key: idx, ...props });
  });
};

const parseCustomMarkdown = (input: string): ReactNode[] => {
  const lines = input.split("\n");
  return lines.map((line, idx) => {
    if (line.includes("<")) {
      return parseXmlLikeSyntax(line);
    }
    // If it's not a custom component, treat it as regular markdown
    // Utilize `dangerouslySetInnerHTML` to render parsed markdown HTML
    return <div key={idx} dangerouslySetInnerHTML={{ __html: marked(line) }} />;
  });
};

export default parseCustomMarkdown;
