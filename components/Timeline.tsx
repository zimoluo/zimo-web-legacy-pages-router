import React from 'react';

interface Props {
  events: Record<string, string>;
}

const Timeline: React.FC<Props> = ({ events }) => {
  const sortedEvents = Object.entries(events).sort((a, b) => 
    new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  return (
    <figure className="relative w-96">
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-400" />
      {sortedEvents.map(([date, text], index) => (
        <div key={index} className="relative flex items-center mb-5">
          <h3 className="absolute left-1/3 text-end">{date}</h3>
          <div className="absolute left-1/2 w-3 h-3 -ml-1.5 bg-neutral-200 border border-neutral-500 rounded-full" />
          <p className="bg-neutral-100 bg-opacity-40 backdrop-blur-xl p-4 absolute left-2/3 rounded-xl">{text}</p>
          <div className="h-20 pointer-events-none select-none" aria-hidden="true" />
        </div>
      ))}
    </figure>
  );
};

export default Timeline;
