import React from "react";

interface TimelineProps {
  events: Record<string, string>;
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const sortedEvents = Object.entries(events).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <div className="relative w-96 mx-0 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2" />
      {sortedEvents.map(([date, text], index) => (
        <div key={index} className={`relative p-4 left-10 mr-10`}>
          <div className="absolute h-full w-0.5 bg-neutral-600 top-0 -left-2" />
          <div className="absolute w-6 h-6 bg-white border-2 border-neutral-600 rounded-full -left-5 top-8" />
          <div
            className={`bg-neutral-50 bg-opacity-40 backdrop-blur-xl shadow-lg p-4 rounded-md ml-6`}
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
