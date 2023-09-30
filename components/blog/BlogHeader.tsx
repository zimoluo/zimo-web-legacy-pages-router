import BlogTitle from "./BlogTitle";
import BlogDescription from "./BlogDescription";
import BlogGrid from "./BlogGrid";

interface BlogHeaderProps {
    title: string;
    description: string;
    authorId: string;
    author: string;
    content: string;
    date: string;
    slug: string;
}
  
const BlogHeader: React.FC<BlogHeaderProps> = ({ title, description, authorId, author, content, date, slug }) => {
    return (
        <>
            <BlogTitle>{title}</BlogTitle>
            <BlogDescription>{description}</BlogDescription>
            <BlogGrid authorId={authorId} author={author} content={content} date={date} slug={slug} ></BlogGrid>
        </>
    );
};
  
export default BlogHeader;
  