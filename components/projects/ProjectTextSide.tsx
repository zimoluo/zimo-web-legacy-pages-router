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
    <div className="w-full">
      <div className="px-8 md:px-10 pt-2 md:pt-4 pb-6 md:pb-8">
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
