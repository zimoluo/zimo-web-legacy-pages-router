import ProjectTile from "./ProjectTile";
import ProjectData from "@/interfaces/projects/projectData";

type Props = {
  entries: ProjectData[]
}

const ProjectTileGrid = ( { entries }: Props ) => {
    return (
        <div className="grid grid-cols-[minmax(128px,1fr)] gap-y-8 gap-x-8 mb-24 px-8 md:px-36">
          {entries.map((entry, index) => (
            <ProjectTile
                key={index}  // <-- Add a unique key prop here
                entry={entry}
            />
          ))}
        </div>
    )
  }

export default ProjectTileGrid
