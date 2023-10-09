import React from 'react';

interface TimelineProps {
  events: Record<string, string>;
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const sortedEvents = Object.entries(events).sort((a, b) => 
    new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  return (
    <div className="relative max-w-screen-md mx-auto">
      <div className="absolute top-0 bottom-0 left-1/2 bg-white w-0.5" />
      {sortedEvents.map(([date, text], index) => (
        <div 
          key={index} 
          className={`relative p-4 w-1/2 ${index % 2 === 0 ? 'left-0' : 'left-1/2'}`}
        >
          <div className="absolute h-full w-0.5 bg-orange-500 top-0 -left-2" />
          <div className="absolute w-6 h-6 bg-white border-4 border-orange-500 rounded-full -left-5" />
          <div className={`bg-white p-4 rounded-md ${index % 2 === 0 ? 'ml-6' : 'mr-6'}`}>
            <h2 className="font-bold mb-2">{date}</h2>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
