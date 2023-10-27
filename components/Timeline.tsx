import React from "react";
import { parse, format, compareAsc } from "date-fns";
import { enrichTextContent } from "@/lib/util";
import {
  ThemeType,
  lightBgColorMap,
  menuEntryBorderMap,
  notchColorMap,
} from "@/interfaces/themeMaps";

interface Props {
  events: Record<string, string>;
  theme?: ThemeType;
}

const Timeline: React.FC<Props> = ({ events, theme = "zimo" }) => {
  const formatDate = (dateStr: string) => {
    // Parsing the date string into a Date object.
    const date = parse(dateStr, "yyyy-M-d", new Date());

    // Formatting the Date object into the desired output string.
    return format(date, "MMMM d, yyyy"); // Example output: September 12, 2023
  };

  const sortedEvents = Object.entries(events).sort((a, b) => {
    // Parsing the date strings into Date objects.
    const dateA = parse(a[0], "yyyy-M-d", new Date());
    const dateB = parse(b[0], "yyyy-M-d", new Date());

    // Comparing the Date objects to sort the array.
    return compareAsc(dateB, dateA);
  });

  const lightBgClass = lightBgColorMap[theme];
  const darkBorderClass = menuEntryBorderMap[theme];
  const darkBgClass = notchColorMap[theme];

  return (
    <figure className="relative -mx-4 px-4 -my-4 py-4 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2" />
      {sortedEvents.map(([date, text], index) => (
        <div key={index} className={`relative p-4 left-6 mr-4`}>
          <div
            className={`absolute h-full w-0.5 ${darkBgClass} top-0 timeline-bar-shift`}
          />
          <div
            className={`absolute w-6 h-6 ${lightBgClass} border-2 ${darkBorderClass} rounded-full -left-5 top-8`}
          />
          <div
            className={`${lightBgClass} bg-opacity-40 backdrop-blur-xl shadow-lg p-4 rounded-xl ml-2`}
          >
            <h3 className="font-bold mb-2 text-lg">{formatDate(date)}</h3>
            <p className="text-base">{enrichTextContent(text)}</p>
          </div>
        </div>
      ))}
    </figure>
  );
};

export default Timeline;
