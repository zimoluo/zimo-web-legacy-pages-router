import { useBlogSearch } from "../contexts/BlogSearchContext";
import BlogCard from "./BlogCard";
import { getCoverSrc } from "@/lib/blog/util";

type Props = {
  posts: (PostData & { unlisted: boolean })[];
};

const BlogCardGrid = ({ posts }: Props) => {
  const { blogSearchContent } = useBlogSearch();

  const processSearchContent = (searchContent: string) => {
    return searchContent
      .trim()
      .split(/[,;，；]+/)
      .map((term) => term.trim()) // Trim each term after splitting
      .filter(Boolean); // Remove empty strings
  };

  const doesMatchTagsFilter = (tags: string[], searchTag: string) => {
    return tags.some((tag) =>
      tag.toLowerCase().startsWith(searchTag.toLowerCase())
    );
  };

  const doesMatchTextFilter = (text: string, searchTerm: string) => {
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const advancedFilter = (post: PostData & { unlisted: boolean }) => {
    // Always exclude unlisted posts
    if (post.unlisted) return false;

    // If search content is empty, include all (non-unlisted) posts
    if (!blogSearchContent.trim()) return true;

    // Process search content into array of search terms
    const searchTerms = processSearchContent(blogSearchContent);

    // Check each search term against the post
    return searchTerms.every((term) => {
      // If it starts with a hashtag, check against tags
      if (term.startsWith("#")) {
        return doesMatchTagsFilter(post.tags || [], term.slice(1));
      }

      // Otherwise, check against title or description
      return (
        doesMatchTextFilter(post.title, term) ||
        doesMatchTextFilter(post.description, term)
      );
    });
  };

  return (
    <div
      className="grid grid-cols-1 gap-y-8 md:gap-y-10 mb-24 px-8 md:px-36"
      style={{
        transition: "height 0.3s ease-in-out",
      }}
    >
      {posts.filter(advancedFilter).map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          coverImage={getCoverSrc(post.coverImage, post.slug)}
          date={post.date}
          author={post.author}
          authorId={post.authorId}
          slug={post.slug}
          description={post.description}
          content={post.content}
          tags={post.tags}
        />
      ))}
    </div>
  );
};

export default BlogCardGrid;
