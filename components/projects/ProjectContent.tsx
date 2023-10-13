import parseCustomMarkdown from "@/lib/markdownParser";

type Props = {
  content: string;
};

const ProjectContent = ({ content }: Props) => {
  return <section>{parseCustomMarkdown(content, "projects")}</section>;
};

export default ProjectContent;
