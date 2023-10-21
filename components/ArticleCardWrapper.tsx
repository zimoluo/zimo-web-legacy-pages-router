import React, { useState, useEffect, useRef } from "react";
import ArticleCard from "./ArticleCard";
import { ArticleCardProps } from "@/interfaces/articleCardData";

type Props = ArticleCardProps & {
  isVisible: boolean;
  timeout: number;
  duration?: number;
};

const ArticleCardWrapper = ({
  title,
  description,
  section,
  slug,
  date,
  theme,
  isVisible,
  timeout,
  duration = 280,
  useCalendarDate = false,
  omitSectionType = false,
}: Props) => {
  const [computedHeight, setComputedHeight] = useState("160px");
  const [displayMaxHeight, setDisplayMaxHeight] = useState("160px");
  const [paddingY, setPaddingY] = useState("20px");
  const [scale, setScale] = useState("1");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.scrollHeight;
      setComputedHeight(`${height + 40}px`);
    }
  }, [cardRef]);

  useEffect(() => {
    const handleAnimation = () => {
      if (isVisible) {
        setPaddingY("20px");
        setScale("1");
        setDisplayMaxHeight(computedHeight);
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
    transition: `max-height ${duration / 1000}s ease-in-out, padding ${
      duration / 1000
    }s ease-in-out, transform ${duration / 1000}s ease-in-out`,
    paddingTop: paddingY,
    paddingBottom: paddingY,
    transform: `scale(${scale})`,
  };

  return (
    <div
      style={defaultStyle}
      className="overflow-hidden px-4 -mx-4"
      ref={cardRef}
    >
      <ArticleCard
        theme={theme}
        title={title}
        section={section}
        slug={slug}
        date={date}
        description={description}
        useCalendarDate={useCalendarDate}
        omitSectionType={omitSectionType}
      />
    </div>
  );
};

export default ArticleCardWrapper;
