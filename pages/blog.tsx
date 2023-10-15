import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import BlogCardGrid from "@/components/blog/BlogCardGrid";
import BlogSearchBox from "@/components/blog/BlogSearchBox";
import { BlogSearchProvider } from "@/components/contexts/BlogSearchContext";
import { getAllPosts } from "@/lib/blog/aws-api";

type Props = {
  allPosts: (PostData & { unlisted: boolean })[];
};

export default function Home({ allPosts }: Props) {
  return (
    <MainPageLayout theme="blog">
      <BlogSearchProvider>
        <MainPageTitle
          title="State and Flow of Mind."
          subtitle="Welcome, my friend. I have been expecting you."
        />
        <nav className="-mt-12 mb-4 flex items-center md:justify-end px-8 md:px-36">
          <div className="w-full search-bar-width">
            <BlogSearchBox />
          </div>
        </nav>
        <BlogCardGrid posts={allPosts} />
      </BlogSearchProvider>
    </MainPageLayout>
  );
}

export const getStaticProps = async () => {
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

  const filteredPosts = allPosts.filter((post) => !(post as any).unlisted);

  return {
    props: { allPosts: filteredPosts },
    revalidate: 25,
  };
};
