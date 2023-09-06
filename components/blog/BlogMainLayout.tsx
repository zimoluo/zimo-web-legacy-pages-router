import { imageFallback } from "@/lib/util";
import BlogContent from "./BlogContent";
import BlogHeader from "./BlogHeader";
import Image from "next/image";
import ShareButtonBar from "../ShareButtonBar";
import { useRouter } from "next/router";

interface BlogProps {
  title: string;
  description: string;
  authorId: string;
  author: string;
  content: string;
  date: string;
  coverSrc: string;
  displayCover: boolean;
}

const BlogMainLayout = ({
  title,
  description,
  authorId,
  author,
  content,
  date,
  coverSrc,
  displayCover,
}: BlogProps) => {
  const router = useRouter();
  const urlShare = typeof window !== 'undefined' ? `${window.location.origin}${router.asPath}` : '';

  return (
    <div className="flex justify-center items-center">
      <div className="relative mt-20 md:mb-20 md:mx-8 px-8 w-full blog-view md:blog-view-middle md:px-14 py-12 md:rounded-3xl md:shadow-xl">
        <div className="absolute top-4 right-4 transform z-10">
          <ShareButtonBar title={title} description={description} url={urlShare}/>
        </div>
        <BlogHeader
          title={title}
          description={description}
          authorId={authorId}
          author={author}
          content={content}
          date={date}
        ></BlogHeader>
        <div className={`my-10 border-fuchsia-700 border-t opacity-50`}></div>
        {coverSrc && displayCover ? (
          <div className="flex justify-center items-center mb-12">
            <Image
              src={coverSrc}
              alt={`Cover of ${title}`}
              width={384}
              height={384}
              className="h-auto w-full object-cover max-h-96 rounded-xl"
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
