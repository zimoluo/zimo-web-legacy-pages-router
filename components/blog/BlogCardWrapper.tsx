import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { getCoverSrc } from "@/lib/blog/util";

type Props = {
  post: PostData & { unlisted: boolean };
  isVisible: boolean;
};

const BlogCardWrapper = ({ post, isVisible }: Props) => {
  const [maxHeight, setMaxHeight] = useState(isVisible ? "none" : "0");

  useEffect(() => {
    setMaxHeight(isVisible ? "none" : "0");
  }, [isVisible]);

  return (
    <div
      style={{
        maxHeight: maxHeight,
        overflow: "hidden",
        transition: "max-height 0.3s ease-in-out",
      }}
      className="py-8 md:py-10"
    >
      <BlogCard
        title={post.title}
        coverImage={getCoverSrc(post.coverImage, post.slug)}
        date={post.date}
        author={post.author}
        authorId={post.authorId}
        slug={post.slug}
        description={post.description}
        content={post.content}
        tags={post.tags}
      />
    </div>
  );
};

export default BlogCardWrapper;
