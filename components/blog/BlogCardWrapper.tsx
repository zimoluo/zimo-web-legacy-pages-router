import React, { useState, useEffect, useRef } from "react";
import BlogCard from "./BlogCard";
import { getCoverSrc } from "@/lib/blog/util";

type Props = {
  post: PostData & { unlisted: boolean };
  isVisible: boolean;
  timeout: number;
};

const BlogCardWrapper = ({ post, isVisible, timeout }: Props) => {
  const [displayMaxHeight, setDisplayMaxHeight] = useState("260");
  const [paddingY, setPaddingY] = useState("16px");
  const [scale, setScale] = useState("1");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAnimation = () => {
      if (isVisible) {
        setPaddingY("16px");
        setScale("1");
        setDisplayMaxHeight("260px");
      } else {
        setPaddingY("0px");
        setScale("0.85");
        setDisplayMaxHeight("0px");
      }
    };

    const timer = setTimeout(handleAnimation, timeout);
    return () => clearTimeout(timer);
  }, [isVisible, timeout]);

  const defaultStyle = {
    maxHeight: displayMaxHeight,
    overflow: "hidden",
    transition:
      "max-height 0.3s ease-in-out, padding 0.3s ease-in-out, transform 0.3s ease-in-out",
    paddingTop: paddingY,
    paddingBottom: paddingY,
    transform: `scale(${scale})`,
  };

  return (
    <div style={defaultStyle} ref={cardRef}>
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
