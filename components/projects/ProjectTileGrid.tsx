import React from "react";
import ProjectTile from "./ProjectTile";
import ProjectData from "@/interfaces/projects/projectData";

type Props = {
  entries: ProjectData[];
};

const ProjectTileGrid: React.FC<Props> = ({ entries }) => {
  return (
    <div className="flex justify-center items-center px-6 md:px-18 mb-24 md:mb-28">
      <section className="project-tile-grid w-full">
        {entries.map((entry, index) => (
          <ProjectTile key={index} {...entry} />
        ))}
      </section>
    </div>
  );
};

export default ProjectTileGrid;
