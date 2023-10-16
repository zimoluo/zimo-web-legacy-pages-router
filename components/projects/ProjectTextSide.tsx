import ProjectsTitleCard from "./ProjectsTitleCard";
import ProjectContent from "./ProjectContent";
import ShareButtonBarProjects from "./ShareButtonBarProjects";
import { useSettings } from "../contexts/SettingsContext";
import { CommentProvider } from "../contexts/CommentContext";
import CommentTypeBox from "../comments/CommentTypeBox";
import CommentCardColumn from "../comments/CommentCardColumn";
import { securityCommentShutDown } from "@/lib/constants";

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
  const { settings } = useSettings();

  return (
    <article className="w-full relative">
      <div className="absolute top-4 right-4 transform z-10">
        <ShareButtonBarProjects
          title={title}
          description={description}
          url={urlShare}
        />
      </div>
      <div className="px-5 md:px-10 pt-4 md:pt-4 pb-6 md:pb-8">
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
        {!settings.disableComments && !securityCommentShutDown && (
          <>
            <div className={`my-8 border-teal-700 border-t opacity-50`} />
            <CommentProvider>
              <CommentTypeBox theme="projects" isExpanded={true} />
              <div className="h-10 pointer-events-none select-none" />
              <CommentCardColumn
                theme="projects"
                resourceLocation={`projects/comments/${slug}.json`}
              />
            </CommentProvider>
          </>
        )}
      </div>
    </article>
  );
};

export default ProjectTextSide;
