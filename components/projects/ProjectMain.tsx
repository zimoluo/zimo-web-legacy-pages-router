import ProjectData from "@/interfaces/projects/projectData";
import ProjectTextSide from "./ProjectTextSide";
import ImageViewer from "../ImageViewer";
import { imagesParser } from "@/lib/util";
import ProjectMainDesktop from "./ProjectMainDesktop";
import { useEffect, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";

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

  const { settings } = useSettings();

  const [shouldRender, setShouldRender] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const handleResize = () => {
      setShouldRender(window.innerWidth >= 768 ? 1 : 2);
    };

    // Initial set of shouldRender after initial rendering
    handleResize();

    // Adding event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup: removing event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {(shouldRender === 0 || shouldRender === 1) && (
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
      )}
      {(shouldRender === 0 || shouldRender === 2) && (
        <div className="pt-16 projects-page-bg md:hidden">
          <div className="mb-0 mx-6">
            <ImageViewer
              url={parsedImage.url}
              text={parsedImage.text}
              aspectRatio={parsedImage.aspectRatio}
              original={parsedImage.original}
              theme="projects"
              defaultGridView={settings.preferInitialGridView}
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
      )}
    </>
  );
}
