import ProjectsTitleCard from "./ProjectsTitleCard";
import ProjectContent from "./ProjectContent";
import ShareButtonBarProjects from "./ShareButtonBarProjects";

interface Props {
  title: string;
  description: string;
  links: { [key: string]: string };
  date: string;
  authors: string[];
  slug: string;
  faviconFormat: string;
  content: string;
}

const ProjectTextSide = ({
  title,
  description,
  links,
  date,
  authors,
  slug,
  faviconFormat,
  content,
}: Props) => {
  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/${slug}`
      : "";

  return (
    <div className="w-full relative">
      <div className="absolute top-4 right-4 transform z-10">
        <ShareButtonBarProjects
          title={title}
          description={description}
          url={urlShare}
        />
      </div>
      <div className="px-8 md:px-10 pt-4 md:pt-4 pb-6 md:pb-8">
        <ProjectsTitleCard
          title={title}
          description={description}
          links={links}
          date={date}
          authors={authors}
          slug={slug}
          faviconFormat={faviconFormat}
        />
        <ProjectContent content={content} />
      </div>
    </div>
  );
};

export default ProjectTextSide;
