import { ThemeType } from "./themeMaps";

export interface ArticleCardProps {
  title: string;
  description?: string;
  section: "photos" | "blog" | "projects" | "management";
  slug: string;
  date?: string;
  theme: ThemeType;
  useCalendarDate?: boolean;
  omitSectionType?: boolean;
}
