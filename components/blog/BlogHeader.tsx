import BlogTitle from "./BlogTitle";
import BlogDescription from "./BlogDescription";
import BlogGrid from "./BlogGrid";
import { enrichTextContent } from "@/lib/util";
import Link from "next/link";

interface BlogHeaderProps {
  title: string;
  description: string;
  authorId: string;
  author: string;
  content: string;
  date: string;
  slug: string;
  tags?: string[];
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  description,
  authorId,
  author,
  content,
  date,
  slug,
  tags = [],
}) => {
  return (
    <>
      <BlogTitle>{title}</BlogTitle>
      <BlogDescription>{enrichTextContent(description)}</BlogDescription>
      <BlogGrid
        authorId={authorId}
        author={author}
        content={content}
        date={date}
        slug={slug}
      />
      {tags.length > 0 && (
        <div className="-mt-4 -mb-2">
          {tags.map((tag, index) => (
            <Link className="mr-1.5" href={`/blog/tags/${tag}`} key={index}>
              <span
                key={index}
                className="inline-block bg-fuchsia-700 opacity-70 rounded-full px-2 my-0.5 py-0.5 text-sm font-bold text-fuchsia-50 transition-transform duration-300 ease-in-out hover:scale-105 text-center"
              >
                {tag}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogHeader;
