import { menuEntryBorderMap } from "@/interfaces/themeMaps";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

  const paddingAmount = 1.5;

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isExpanded
      ? `calc(${maxHeight} + ${paddingAmount * 2}rem)`
      : "0px",
    padding: isExpanded ? `${paddingAmount}rem 0` : "0",
    transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
  };

  return (
    <div
      className={`${
        index !== 0 ? "border-about-pane-t" : ""
      } ${borderColorClass} px-4 text-2xl`}
    >
      <div className="w-full flex items-center mt-4 font-bold">
        <div>{question}</div>
        <div className="flex-grow flex items-center justify-end">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <Image
              alt="Expand or Collapse This Question"
              className={`h-6 w-auto aspect-square transform transition-transform duration-300 hover:scale-110 ${
                isExpanded ? "rotate-0" : "-rotate-180"
              }`}
              height={24}
              width={24}
              src="/expand-collapse-photos.svg"
            />
          </button>
        </div>
      </div>
      <div style={columnStyle} ref={columnRef} className="mb-4 text-xl">
        {description}
      </div>
    </div>
  );
};

export default AboutQuestion;
