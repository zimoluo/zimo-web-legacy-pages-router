import MainPageLayout from "@/components/MainPageLayout";
import BlogCardGrid from "@/components/blog/BlogCardGrid";
import BlogSearchBox from "@/components/blog/BlogSearchBox";
import { BlogSearchProvider } from "@/components/contexts/BlogSearchContext";
import { getAllPosts } from "@/lib/blog/aws-api";

type Props = {
  allPosts: (PostData & { unlisted: boolean })[];
  tag: string;
};

export default function Home({ allPosts, tag }: Props) {
  return (
    <MainPageLayout theme="blog">
      <BlogSearchProvider>
        <section className="min-h-screen mt-20">
          <h1 className="px-8 md:px-36 text-2xl font-bold mb-8">
            {`#${tag}`}
          </h1>
          <nav className="mb-4 flex items-center md:justify-end px-8 md:px-36">
            <div className="w-full">
              <BlogSearchBox />
            </div>
          </nav>
          <BlogCardGrid posts={allPosts} />
        </section>
      </BlogSearchProvider>
    </MainPageLayout>
  );
}

export const getStaticProps = async (context: { params: { tag: string } }) => {
  // Extract tag from path
  const { tag } = context.params;

  console.warn(tag);

  // Fetch all posts
  const allPosts = await getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "unlisted",
    "tags",
  ]);

  // Filter posts based on tag
  const filteredPosts = allPosts.filter((post) => post.tags?.includes(tag));

  // Return filtered posts as props
  return {
    props: { allPosts: filteredPosts, tag },
    revalidate: 25,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
