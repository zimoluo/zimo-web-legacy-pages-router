import {
  ThemeType,
  lightBgColorMap,
  placeholderTextColorMap,
  sliderBorderColorMap,
} from "@/interfaces/themeMaps";
import { useBlogSearch } from "../contexts/BlogSearchContext";

interface Props {
  theme?: ThemeType;
  keyword?: string;
}

const BlogSearchBox = ({ theme = "blog", keyword = "blog article" }: Props) => {
  const { blogSearchContent, setBlogSearchContent } = useBlogSearch();
  const handleChange = (event: any) => {
    setBlogSearchContent(event.target.value);
  };

  const lightBgColor = lightBgColorMap[theme];
  const borderColor = sliderBorderColorMap[theme];
  const placeholderColor = placeholderTextColorMap[theme];

  return (
    <input
      type="text"
      value={blogSearchContent}
      onChange={handleChange}
      placeholder={`Search ${keyword}...`}
      className={`w-full py-2 px-3 border rounded-full overflow-hidden ${lightBgColor} bg-opacity-60 backdrop-blur-lg ${borderColor} border-opacity-75 border-menu-entry shadow-lg ${placeholderColor} placeholder:text-opacity-50`}
    />
  );
};

export default BlogSearchBox;
