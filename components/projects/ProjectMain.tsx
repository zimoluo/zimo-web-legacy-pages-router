import ProjectData from "@/interfaces/projects/projectData"
import ProjectTextSide from "./ProjectTextSide"
import ImageViewer from "../ImageViewer"
import { imagesParser } from "@/lib/util"

export default function ProjectMain({ title, description, links, date, images, authors, slug, faviconFormat, content }: ProjectData) {
  
    const parsedImage = imagesParser(images);
  
    return (
      <div className="md:grid md:grid-cols-[1fr,1fr] md:mb-20 pt-16 md:pt-10 md:mt-14 md:pb-10 projects-page-bg">
        <div className="mb-0 mx-6 md:ml-4 md:mr-2">
          <ImageViewer url={parsedImage.url} text={parsedImage.text} aspectRatio={parsedImage.aspectRatio} theme="projects" />
        </div>
        <div className="mx-0 mt-4 md:mt-0 md:ml-2 md:mr-4 ">
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