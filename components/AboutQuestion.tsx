import { menuEntryBorderMap } from "@/interfaces/themeMaps";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { enrichTextContent } from "@/lib/util";

type Props = {
  question: string;
  description: string;
  index?: number;
};

const AboutQuestion: React.FC<Props> = ({
  question,
  description,
  index = 0,
}) => {
  const borderColorClass = menuEntryBorderMap["about"];
  const [isExpanded, setIsExpanded] = useState(false);

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (columnRef.current) {
      const height = columnRef.current.scrollHeight;
      setMaxHeight(`${height}px`);
    }
  }, [columnRef]);

  const paddingAmount = 1.8;

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isExpanded
      ? `calc(${maxHeight} + ${paddingAmount * 2}rem)`
      : "0px",
    padding: isExpanded ? `${paddingAmount}rem 0` : "0",
    transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
  };

  return (
    <section
      className={`${
        index !== 0 ? "border-about-pane-t" : ""
      } ${borderColorClass} border-opacity-20 text-base md:text-lg cursor-pointer`}
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
    >
      <div className="w-full flex items-center mt-4">
        <h2>{enrichTextContent(question)}</h2>
        <div className="flex-grow flex items-center justify-end ml-6 md:ml-10 flex-shrink-0">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <Image
              alt="Expand or Collapse This Question"
              className={`h-5 md:h-6 w-auto aspect-square transform transition-transform duration-300 hover:scale-110 ${
                isExpanded ? "-rotate-180" : "rotate-0"
              }`}
              height={24}
              width={24}
              src="/expand-collapse-about.svg"
            />
          </button>
        </div>
      </div>
      <p
        style={columnStyle}
        ref={columnRef}
        className="mb-4 text-base md:text-lg text-sky-800 text-opacity-90"
      >
        {enrichTextContent(description)}
      </p>
    </section>
  );
};

export default AboutQuestion;
