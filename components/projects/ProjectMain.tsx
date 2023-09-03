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
        <div className="grid grid-cols-[2fr,3fr]">
            <div>
                <ImageViewer url={parsedImage.url} text={parsedImage.text} aspectRatio={parsedImage.aspectRatio} />
            </div>
            <div>
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
    )
}