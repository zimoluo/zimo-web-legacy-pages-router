import parseCustomMarkdown from "@/lib/markdownParser";

type BlogContentProps = {
  content: string;
};

const BlogContent = ({ content }: BlogContentProps) => {
  return <section>{parseCustomMarkdown(content)}</section>;
};

export default BlogContent;
