import ManagementLayout from "@/components/about/ManagementLayout";
import { ManagementThemeProvider } from "@/components/contexts/ManagementThemeContext";
import { ArticleCardProps } from "@/interfaces/articleCardData";
import { getAllPosts } from "@/lib/about/aws-api";

type Props = {
  allPosts: ArticleCardProps[];
};

export default function Home({ allPosts }: Props) {
  return (
    <ManagementThemeProvider>
      <ManagementLayout posts={allPosts} />
    </ManagementThemeProvider>
  );
}

export const getStaticProps = async () => {
  const allPosts = await getAllPosts([
    "title",
    "date",
    "slug",
    "description",
    "unlisted",
  ]);

  const filteredPosts = allPosts.filter((post) => !(post as any).unlisted);

  const updatedPosts = filteredPosts.map((post) => ({
    ...post,
    section: "management",
    useCalendarDate: true,
    omitSectionType: true,
  }));

  return {
    props: { allPosts: updatedPosts },
    revalidate: 25,
  };
};
