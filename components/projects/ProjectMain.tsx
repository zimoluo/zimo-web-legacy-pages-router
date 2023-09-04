import ProjectData from "@/interfaces/projects/projectData"
import ProjectTextSide from "./ProjectTextSide"
import ImageViewer from "../ImageViewer"
import { imagesParser } from "@/lib/util"

export default function ProjectMain({ title, description, links, date, images, authors, slug, faviconFormat, content }: ProjectData) {
  
    const parsedImage = imagesParser(images);
  
    return (
      <div className="md:grid md:grid-cols-[1fr,1fr] md:mb-20 mt-14">
        <div className="mb-0 mx-6 md:ml-4 md:mr-2">
          <ImageViewer url={parsedImage.url} text={parsedImage.text} aspectRatio={parsedImage.aspectRatio} theme="projects" />
        </div>
        <div className="mx-0 mt-4 md:mt-0 projects-popup-bg bg-opacity-60 md:ml-2 md:mr-4 md:bg-opacity-0 md:backdrop-filter-none">
          <ProjectTextSide
            title={title}
            description={description}
            links={links}
            date={date}
            authors={authors}
            slug={slug}
            faviconFormat={faviconFormat}
            content={content}
          />
        </div>
      </div>
    );
  }