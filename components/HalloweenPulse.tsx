import React from "react";

const HalloweenPulse: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-screen h-screen z-90 bg-halloween-pulse bg-opacity-50 animate-halloween-pulse pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};

export default HalloweenPulse;
