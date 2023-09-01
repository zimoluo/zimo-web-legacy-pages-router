import ProjectData from "@/interfaces/projects/projectData"
import ProjectImages from "./ProjectImages"
import ProjectTextSide from "./ProjectTextSide"

type ProjectType = {
    entry: ProjectData
}

export default function ProjectMain({ entry }: ProjectType) {
    return (
        <div className="grid grid-cols-[2fr,3fr]">
            <div>
                <ProjectImages images={entry.images}/>
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