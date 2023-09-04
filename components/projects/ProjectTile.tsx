import ProjectData from "@/interfaces/projects/projectData";
import { getProjectFavicon } from "@/lib/projects/util";
import { imageFallback } from "@/lib/util";
import Image from "next/image";
import { useEffect, useState } from "react";
import DarkOverlay from "../DarkOverlay";
import ProjectMainPopup from "./ProjectMainPopUp";

type Props = {
  entry: ProjectData;
};

const ProjectTile: React.FC<Props> = ({ entry }) => {
  const [showPopup, setShowPopup] = useState(false);

  const projectClick = () => {
    setShowPopup(true);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopUp();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <button
        className="group flex items-center justify-center h-48 aspect-square w-auto rounded-xl backdrop-blur-lg shadow-lg px-6 py-6 bar-color-projects overflow-hidden"
        onClick={projectClick}
      >
        <Image
          height={32}
          width={32}
          src={getProjectFavicon(entry.slug, entry.faviconFormat)}
          className="h-20 w-auto transform transition-transform ease-in duration-200 group-hover:scale-125 opacity-90"
          alt={entry.title}
          onError={imageFallback("/projects-zimo.svg")}
        />
        <p className="absolute top-40 left-1/2 -translate-x-1/2 w-44 text-center font-bold text-teal-700 transition-all ease-in duration-200 opacity-0 group-hover:opacity-60 group-hover:top-38">
          {entry.title}
        </p>
      </button>
      {showPopup && (
        <div className={`pointer-events-none `}>
          <DarkOverlay />
        </div>
      )}
      {showPopup && <ProjectMainPopup entry={entry} onClose={closePopUp} />}
    </>
  );
};

export default ProjectTile;
