import React, { useEffect } from "react";

const DarkOverlay = () => {
  useEffect(() => {
    // Initially set overflow to 'hidden'
    document.body.style.overflow = "hidden";

    // Function to handle mutations
    const handleMutation = (mutations: any) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          document.body.style.overflow = "hidden";
        }
      }
    };

    // Create an observer and attach the handler
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { attributes: true });

    // Cleanup function to revert the overflow property and disconnect the observer
    return () => {
      document.body.style.overflow = "auto"; // 'auto' is typically the default value
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl z-50 select-none " />
  );
};

export default DarkOverlay;
