import React, { useState, useEffect, useRef } from "react";
import BlogCard from "./BlogCard";
import { getCoverSrc } from "@/lib/blog/util";

type Props = {
  post: PostData & { unlisted: boolean };
  isVisible: boolean;
  reducedAnimation?: boolean;
};

const BlogCardWrapper = ({
  post,
  isVisible,
  reducedAnimation = false,
}: Props) => {
  const [maxHeight, setMaxHeight] = useState("1000px");
  const [paddingY, setPaddingY] = useState(isVisible ? "16px" : "0px");
  const [scale, setScale] = useState(isVisible ? "1" : "0.85");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.scrollHeight;
      setMaxHeight(`${height}px`);
    }
  }, []);

  useEffect(() => {
    setPaddingY(isVisible ? "16px" : "0px");
    setScale(isVisible ? "1" : "0.85");
  }, [isVisible]);

  const defaultStyle = {
    maxHeight: isVisible ? maxHeight : "0px",
    overflow: "hidden",
    transition:
      "max-height 0.3s ease-in-out, padding 0.3s ease-in-out, transform 0.3s ease-in-out",
    paddingTop: paddingY,
    paddingBottom: paddingY,
    transform: `scale(${scale})`,
  };

  const reducedStyle = {
    maxHeight: isVisible ? maxHeight : "0px",
    overflow: "hidden",
    paddingTop: paddingY,
    paddingBottom: paddingY,
    opacity: isVisible ? "1" : "0",
  };

  return (
    <div style={reducedAnimation ? reducedStyle : defaultStyle} ref={cardRef}>
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
