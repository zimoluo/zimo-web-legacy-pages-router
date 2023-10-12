import { useBlogSearch } from "../contexts/BlogSearchContext";

const BlogSearchBox = () => {
  const { blogSearchContent, setBlogSearchContent } = useBlogSearch();
  const handleChange = (event: any) => {
    setBlogSearchContent(event.target.value);
  };

  return (
    <input
      type="text"
      value={blogSearchContent}
      onChange={handleChange}
      placeholder="Search blog article..."
      className="w-full py-2 px-3 border rounded-full overflow-hidden bg-fuchsia-50 bg-opacity-60 backdrop-blur-lg border-fuchsia-300 border-opacity-75 border-menu-entry shadow-lg placeholder:text-fuchsia-700 placeholder:text-opacity-50"
    />
  );
};

export default BlogSearchBox;
