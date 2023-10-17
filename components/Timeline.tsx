import React from "react";
import { parse, format, compareAsc } from "date-fns";

interface TimelineProps {
  events: Record<string, string>;
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
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

  return (
    <div className="relative mx-0 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2" />
      {sortedEvents.map(([date, text], index) => (
        <div key={index} className={`relative p-4 left-6 mr-4`}>
          <div className="absolute h-full w-0.5 bg-neutral-600 top-0 -left-2" />
          <div className="absolute w-6 h-6 bg-white border-2 border-neutral-600 rounded-full -left-5 top-8" />
          <div
            className={`bg-neutral-50 bg-opacity-40 backdrop-blur-xl shadow-lg p-4 rounded-xl ml-6`}
          >
            <h3 className="font-bold mb-2">{formatDate(date)}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
