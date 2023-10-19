import {
  ThemeType,
  lightBgColorMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import { formatDate } from "@/lib/util";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  theme: ThemeType;
  title: string;
  description?: string;
  section: "photos" | "blog" | "projects" | "management";
  slug: string;
  date?: string;
  className?: string;
}

const ArticleCard = ({
  theme,
  title,
  section,
  slug,
  description,
  date,
  className = "",
}: Props) => {
  const routerPathname = useRouter().pathname;
  const isAbout = routerPathname.startsWith("/about");

  const sectionMap: { [key: string]: string } = {
    photos: "Album",
    blog: "Blog",
    projects: "Projects",
    management: "Management",
  };

  const lightBgClass = lightBgColorMap[theme];
  const textColorClass = textColorMap[theme];

  return (
    <Link
      href={`/${
        isAbout && section === "management" ? "about" : section
      }/${slug}`}
    >
      <div
        className={`px-4 pt-4 pb-7 rounded-xl backdrop-blur-md shadow-lg ${lightBgClass} bg-opacity-60 relative ${className}`}
      >
        <h3 className={`text-lg font-bold ${textColorClass}`}>{title}</h3>
        {description && (
          <p className={`text-base opacity-90 ${textColorClass}`}>
            {description}
          </p>
        )}
        <div className="absolute bottom-1 right-2.5 text-sm font-bold">
          {`${date ? `${formatDate(date)}  ·  ` : ""}${sectionMap[section]}`}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
