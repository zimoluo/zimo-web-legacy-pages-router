import PostData from "@/interfaces/blog/postData"
import BlogCard from "./BlogCard"
import { getCoverSrc } from "@/lib/blog/util"

type Props = {
    posts: PostData[]
}

const BlogCardGrid = ({ posts }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-y-10 mb-24 px-8 md:px-36">
          {posts.map((post) => (
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
            />
          ))}
        </div>
    )
  }

  export default BlogCardGrid