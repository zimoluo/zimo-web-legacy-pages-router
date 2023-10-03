import ProjectData from "@/interfaces/projects/projectData";
import ProjectTextSide from "./ProjectTextSide";
import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import ProjectMainDesktop from "./ProjectMainDesktop";

export default function ProjectMain({
  title,
  description,
  links,
  date,
  images,
  authors,
  slug,
  faviconFormat,
  content,
}: ProjectData) {
  const parsedImage = imagesParser(images);

  return (
    <>
      <ProjectMainDesktop
        title={title}
        description={description}
        links={links}
        date={date}
        authors={authors}
        slug={slug}
        faviconFormat={faviconFormat}
        content={content}
        images={images}
      />
      <div className="pt-16 projects-page-bg md:hidden">
        <div className="mb-0 mx-6">
          <ImageViewer
            url={parsedImage.url}
            text={parsedImage.text}
            aspectRatio={parsedImage.aspectRatio}
            original={parsedImage.original}
            theme="projects"
          />
        </div>
        <div className="mx-0 mt-4">
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
    </>
  );
}
