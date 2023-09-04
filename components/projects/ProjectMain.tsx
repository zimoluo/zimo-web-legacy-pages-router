import ProjectData from "@/interfaces/projects/projectData"
import ProjectTextSide from "./ProjectTextSide"
import ImageViewer from "../ImageViewer"
import { imagesParser } from "@/lib/util"

type ProjectType = {
    entry: ProjectData
}

export default function ProjectMain({ entry }: ProjectType) {
  
    const parsedImage = imagesParser(entry.images);
  
    return (
      <div className="md:grid md:grid-cols-[1fr,1fr] md:mb-20 mt-14">
        <div className="mb-0 mx-6 md:ml-4 md:mr-2">
          <ImageViewer url={parsedImage.url} text={parsedImage.text} aspectRatio={parsedImage.aspectRatio} theme="projects" />
        </div>
        <div className="mx-0 md:ml-2 md:mr-4 ">
          <ProjectTextSide
            title={entry.title}
            description={entry.description}
            links={entry.links}
            date={entry.date}
            authors={entry.authors}
            slug={entry.slug}
            faviconFormat={entry.faviconFormat}
            content={entry.content}
          />
        </div>
      </div>
    );
  }