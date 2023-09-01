import ProjectsTitleCard from "./ProjectsTitleCard";
import ProjectContent from "./ProjectContent";

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
  return (
    <div className="w-full h-full">
      <div className="mt-20 md:mb-20 px-8 md:px-14 py-0">
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
