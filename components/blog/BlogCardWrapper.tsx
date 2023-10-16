import React, { useState, useEffect, useRef } from "react";
import BlogCard from "./BlogCard";
import { getCoverSrc } from "@/lib/blog/util";

type Props = {
  post: PostData & { unlisted: boolean };
  isVisible: boolean;
  timeout: number;
};

const BlogCardWrapper = ({ post, isVisible, timeout }: Props) => {
  const [maxHeight, setMaxHeight] = useState("1000px");
  const [displayMaxHeight, setDisplayMaxHeight] = useState(
    isVisible ? maxHeight : "0px"
  );
  const [paddingY, setPaddingY] = useState(isVisible ? "16px" : "0px");
  const [scale, setScale] = useState(isVisible ? "1" : "0.85");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const height = cardRef.current.scrollHeight;
        setMaxHeight(`${height}px`);
      }
    };

    // Set initial maxHeight
    handleResize();

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cardRef]);

  useEffect(() => {
    const handleAnimation = () => {
      if (isVisible) {
        setPaddingY("16px");
        setScale("1");
        setDisplayMaxHeight(maxHeight);
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
