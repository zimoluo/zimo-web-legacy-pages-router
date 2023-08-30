import { imageFallback } from "@/lib/blog/util";
import BlogContent from "./BlogContent";
import BlogHeader from "./BlogHeader";
import Image from "next/image";

interface BlogProps {
  title: string;
  description: string;
  authorId: string;
  author: string;
  content: string;
  date: string;
  coverSrc: string;
}

const BlogMainLayout = ({
  title,
  description,
  authorId,
  author,
  content,
  date,
  coverSrc,
}: BlogProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="mt-20 md:mb-20 md:mx-8 px-8 w-full blog-view md:blog-view-middle md:px-14 py-12 md:rounded-3xl md:drop-shadow-xl">
        <BlogHeader
          title={title}
          description={description}
          authorId={authorId}
          author={author}
          content={content}
          date={date}
        ></BlogHeader>
        <div className={`my-10 border-fuchsia-700 border-t opacity-50`}></div>
        {coverSrc ? (
          <div className="flex justify-center items-center mb-12">
            <Image
              src={coverSrc}
              alt={`Cover of ${title}`}
              width={384}
              height={384}
              className="h-auto w-full object-cover max-h-96"
              onError={imageFallback('/blog-fallback.svg')}
            ></Image>
          </div>
        ) : null}
        <BlogContent content={content}></BlogContent>
      </div>
    </div>
  );
};

export default BlogMainLayout;
