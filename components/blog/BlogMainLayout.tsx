import { imageFallback } from "@/lib/util";
import BlogContent from "./BlogContent";
import BlogHeader from "./BlogHeader";
import Image from "next/image";
import ShareButtonBar from "../ShareButtonBar";
import { useRouter } from "next/router";
import { CommentProvider } from "../contexts/CommentContext";
import CommentTypeBox from "../comments/CommentTypeBox";
import CommentCardColumn from "../comments/CommentCardColumn";
import { useSettings } from "../contexts/SettingsContext";
import { securityCommentShutDown } from "@/lib/constants";
import { ReactNode } from "react";

interface BlogProps {
  title: string;
  description: string;
  authorId: string;
  author: string;
  content?: string;
  date: string;
  coverSrc: string;
  displayCover: boolean;
  slug: string;
  tags?: string[];
  children?: ReactNode;
}

const BlogMainLayout = ({
  title,
  description,
  authorId,
  author,
  content = "",
  date,
  coverSrc,
  displayCover,
  slug,
  tags = [],
  children = undefined,
}: BlogProps) => {
  const router = useRouter();
  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}${router.asPath}`
      : "";
  const { settings } = useSettings();

  return (
    <div className="flex justify-center items-center">
      <article className="relative mt-16 md:mt-20 md:mb-20 md:mx-8 px-6 w-full blog-view md:blog-view-middle md:px-14 pb-12 pt-16 md:rounded-3xl md:shadow-xl">
        <div className="absolute top-4 right-4 transform z-10">
          <ShareButtonBar
            title={title}
            description={description}
            url={urlShare}
          />
        </div>
        <BlogHeader
          title={title}
          description={description}
          authorId={authorId}
          author={author}
          content={content}
          date={date}
          slug={slug}
          tags={tags}
        />
        <div className={`my-10 border-fuchsia-700 border-t opacity-50`} />
        {coverSrc && displayCover ? (
          <div className="flex justify-center items-center mb-12">
            <Image
              src={coverSrc}
              alt={`Cover of ${title}`}
              width={384}
              height={384}
              className="h-auto w-full object-cover max-h-96 rounded-xl"
              onError={imageFallback("/blog-fallback.svg")}
            ></Image>
          </div>
        ) : null}
        {children ? children : <BlogContent content={content} />}
        {!settings.disableComments && !securityCommentShutDown && (
          <>
            <div className={`my-10 border-fuchsia-700 border-t opacity-50`} />
            <CommentProvider>
              <CommentTypeBox theme="blog" isExpanded={true} />
              <div className="h-10 pointer-events-none select-none" />
              <CommentCardColumn
                theme="blog"
                resourceLocation={`blog/comments/${slug}.json`}
              />
            </CommentProvider>
          </>
        )}
      </article>
    </div>
  );
};

export default BlogMainLayout;
