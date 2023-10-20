import { ArticleCardProps } from "@/interfaces/articleCardData";
import MainPageLayout from "../MainPageLayout";
import { BlogSearchProvider } from "../contexts/BlogSearchContext";
import Head from "next/head";
import BlogSearchBox from "../blog/BlogSearchBox";
import ArticleCardGrid from "../ArticleCardGrid";
import { useSettings } from "../contexts/SettingsContext";
import ChangeManagementThemeButton from "../ChangeManagementThemeButton";

interface Props {
  posts: ArticleCardProps[];
}

const ManagementLayout = ({ posts }: Props) => {
  const { settings } = useSettings();

  return (
    <MainPageLayout theme={settings.preferredManagementTheme}>
      <Head>
        <title>{`Management - Zimo`}</title>
      </Head>
      <BlogSearchProvider>
        <section className="min-h-screen mt-20">
          <div className="relative mx-8 md:mx-36">
            <h1 className="text-3xl font-bold mb-2 text-center">Management</h1>
            <h2 className="mb-8 text-center text-xl">
              Find articles on Zimo Web&apos;s management and policies here.
            </h2>
            <div className="absolute top-0 right-0 h-7 md:h-8 w-auto aspect-square">
              <ChangeManagementThemeButton />
            </div>
          </div>
          <nav className="mb-4 flex items-center md:justify-end px-8 md:px-36">
            <div className="w-full">
              <BlogSearchBox
                keyword="management article"
                theme={settings.preferredManagementTheme}
              />
            </div>
          </nav>
          <ArticleCardGrid
            posts={posts}
            theme={settings.preferredManagementTheme}
          />
        </section>
      </BlogSearchProvider>
    </MainPageLayout>
  );
};

export default ManagementLayout;
