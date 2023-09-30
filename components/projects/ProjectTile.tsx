import ProjectData from "@/interfaces/projects/projectData";
import { getProjectFavicon } from "@/lib/projects/util";
import { imageFallback } from "@/lib/util";
import Image from "next/image";
import { useState } from "react";
import DarkOverlay from "../DarkOverlay";
import ProjectMainPopup from "./ProjectMainPopUp";
import Link from "next/link";

const ProjectTile: React.FC<ProjectData> = ({
  title,
  description,
  links,
  date,
  images,
  authors,
  slug,
  faviconFormat,
  content,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopUp = () => {
    setShowPopup(true);
    window.history.pushState({ popupOpen: true }, "", `#${slug}`);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Link href={`/projects/${slug}`}>
        <button
          className="group flex items-center relative justify-center h-36 md:h-48 aspect-square w-auto rounded-xl backdrop-blur-lg shadow-lg px-6 py-6 bar-color-projects overflow-hidden"
          onClick={(e) => {
            if (window.innerWidth >= 768) {
              e.preventDefault();
              openPopUp();
            }
          }}
        >
          <Image
            height={32}
            width={32}
            src={getProjectFavicon(slug, faviconFormat)}
            className="h-12 md:h-20 w-auto transform transition-transform ease-in duration-200 group-hover:scale-110 opacity-90"
            alt={title}
            onError={imageFallback("/projects-zimo.svg")}
          />
          <p className="absolute top-28 md:top-40 left-1/2 -translate-x-1/2 w-44 text-center font-bold text-teal-700 transition-all text-sm md:text-base ease-in duration-200 opacity-0 group-hover:opacity-60 group-hover:top-26 special-top-38-md">
            {title}
          </p>
        </button>
      </Link>
      {showPopup && (
        <div className={`pointer-events-none `}>
          <DarkOverlay />
        </div>
      )}
      {showPopup && (
        <ProjectMainPopup
          title={title}
          description={description}
          links={links}
          date={date}
          images={images}
          authors={authors}
          slug={slug}
          faviconFormat={faviconFormat}
          content={content}
          onClose={closePopUp}
        />
      )}
    </>
  );
};

export default ProjectTile;
