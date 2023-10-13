import parseCustomMarkdown from "@/lib/markdownParser";

type BlogContentProps = {
  content: string;
};

const BlogContent = ({ content }: BlogContentProps) => {
  return <section>{parseCustomMarkdown(content, "blog")}</section>;
};

export default BlogContent;
