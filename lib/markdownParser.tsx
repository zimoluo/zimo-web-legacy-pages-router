import ImageViewer from "@/components/ImageViewer";
import MusicPlayerCard from "@/components/MusicPlayerCard";
import React from "react";
import { ReactNode } from "react";
import { marked } from "marked";
import blogMarkdownStyles from "@/components/blog/blog-markdown-styles.module.css";
import zimoMarkdownStyles from "@/components/about/zimo-markdown-styles.module.css";
import aboutMarkdownStyles from "@/components/about/about-markdown-styles.module.css";
import projectsMarkdownStyles from "@/components/projects/projects-markdown-styles.module.css";
import generalMarkdownStyles from "@/components/general-text-markdown.module.css";
import { ThemeType } from "@/interfaces/themeMaps";
import katex from "katex";
import codeBoxExtraStyle from "@/components/code-box-extra.module.css";

const componentsMap: { [key: string]: React.FC<any> } = {
  ImageViewer,
  MusicPlayerCard,
};

const specificStyleMap = {
  blog: blogMarkdownStyles,
  zimo: zimoMarkdownStyles,
  about: aboutMarkdownStyles,
  photos: zimoMarkdownStyles,
  projects: projectsMarkdownStyles,
};

const parseCustomComponent = (
  componentName: string,
  propsString: string,
  idx: number
): ReactNode => {
  // Parse the props and render the corresponding component with them
  try {
    const props = JSON.parse(`{${propsString}}`);
    const Component = componentsMap[componentName];
    return <Component key={idx} {...props} />;
  } catch (error) {
    console.error(
      `Failed to parse or render component ${componentName}:`,
      error
    );
    // Return an error message or fallback component to display in the UI
    return (
      <div key={idx} style={{ color: "red" }}>
        Error rendering component {componentName}
      </div>
    );
  }
};

const parseMathAndMarkdown = (input: string): string => {
  let output = input;

  // Replace block math: $$...$$
  output = output.replace(/\$\$(.+?)\$\$/g, (match, p1) => {
    return katex.renderToString(p1, { throwOnError: false, displayMode: true });
  });

  // Replace inline math: $...$
  output = output.replace(/\$(.+?)\$/g, (match, p1) => {
    return katex.renderToString(p1, {
      throwOnError: false,
      displayMode: false,
    });
  });

  return marked(output);
};

const parseCustomMarkdown = (
  input: string,
  theme?: ThemeType,
  enableSerif?: boolean
): ReactNode[] => {
  const appliedEnableSerif = enableSerif || false;
  const appliedTheme = theme || "blog";

  // Split by empty lines or lines with just whitespace
  const blocks = input.split(/(&&\{\w+\}\{.+?\}&&)/g);
  return blocks.map((block, idx) => {
    const componentNameMatch = block.match(/&&\{(\w+)\}\{(.+?)\}&&/);

    if (componentNameMatch) {
      const [, componentName, propsString] = componentNameMatch;

      // Check if the component name exists in the components map
      if (componentsMap[componentName]) {
        // Parse it as a custom component
        return parseCustomComponent(componentName, propsString, idx);
      }
    }
    // If it's not a custom component, treat it as regular markdown
    return (
      <div
        key={idx}
        dangerouslySetInnerHTML={{ __html: parseMathAndMarkdown(block) }}
        className={`${generalMarkdownStyles["markdown"]} ${
          specificStyleMap[appliedTheme]["markdown"]
        } ${
          appliedEnableSerif ? generalMarkdownStyles["markdown-serif"] : ""
        } ${codeBoxExtraStyle["markdown"]} regular-article-module`}
      />
    );
  });
};

export default parseCustomMarkdown;
