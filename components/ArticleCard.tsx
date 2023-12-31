import { ArticleCardProps } from "@/interfaces/articleCardData";
import { lightBgColorMap, textColorMap } from "@/interfaces/themeMaps";
import { calendarDate } from "@/lib/about/util";
import { formatDate } from "@/lib/util";
import Link from "next/link";
import { useSettings } from "./contexts/SettingsContext";

type Props = ArticleCardProps & {
  className?: string;
};

const ArticleCard = ({
  theme,
  title,
  section,
  slug,
  description,
  date,
  className = "",
  useCalendarDate = false,
  omitSectionType = false,
}: Props) => {
  const { settings } = useSettings();

  const sectionMap: { [key: string]: string } = {
    photos: "Album",
    blog: "Blog",
    projects: "Projects",
    management: "Management",
  };

  const lightBgClass = lightBgColorMap[theme];
  const textColorClass = textColorMap[theme];

  return (
    <Link href={`/${section}/${slug}`}>
      <div
        className={`px-4 pt-4 pb-7 rounded-xl ${
          settings.disableBackgroundBlur ? "" : "backdrop-blur-md"
        } shadow-lg ${lightBgClass} bg-opacity-60 ${
          settings.disableBackgroundBlur && theme === "about"
            ? "bg-center bg-cover bg-color-about-opaque"
            : ""
        } relative ${className}`}
      >
        <h3 className={`text-lg font-bold ${textColorClass}`}>{title}</h3>
        {description && (
          <p className={`text-base opacity-90 ${textColorClass}`}>
            {description}
          </p>
        )}
        <div className="absolute bottom-1 right-2.5 text-sm font-bold">
          {`${
            date
              ? `${useCalendarDate ? calendarDate(date) : formatDate(date)}${
                  omitSectionType ? "" : "  ·  "
                }`
              : ""
          }${omitSectionType ? "" : sectionMap[section]}`}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
