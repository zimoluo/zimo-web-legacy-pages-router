import { ArticleCardProps } from "@/interfaces/articleCardData";
import MainPageLayout from "../MainPageLayout";
import { useManagementTheme } from "../contexts/ManagementThemeContext";
import { BlogSearchProvider } from "../contexts/BlogSearchContext";
import Head from "next/head";
import BlogSearchBox from "../blog/BlogSearchBox";
import ArticleCardGrid from "../ArticleCardGrid";
import Image from "next/image";
import { useState } from "react";

interface Props {
  posts: ArticleCardProps[];
}

const ManagementLayout = ({ posts }: Props) => {
  const { managementTheme, setManagementTheme } = useManagementTheme();
  const [isSpinning, setIsSpinning] = useState(false);

  function changeTheme() {
    setIsSpinning(true);

    setTimeout(
      () => setManagementTheme(managementTheme === "zimo" ? "about" : "zimo"),
      300
    );

    setTimeout(() => setIsSpinning(false), 600);
  }

  return (
    <MainPageLayout theme={managementTheme}>
      <Head>
        <title>{`Management - Zimo`}</title>
      </Head>
      <BlogSearchProvider>
        <section className="min-h-screen mt-20">
          <div className="relative mx-8 md:mx-36">
            <h1 className="text-3xl font-bold mb-2 text-center">Management</h1>
            <h2 className="mb-8 text-center text-xl">
              Find articles on Zimo Web's management and policies here.
            </h2>
            <button
              className={`h-7 md:h-8 w-auto aspect-square absolute top-0 right-0 rotate-0 group ${
                isSpinning ? "animate-spin-theme-button" : ""
              }`}
              onClick={changeTheme}
            >
              <Image
                src="/zimo-favicon.svg"
                alt="Change theme"
                className={`transition-transform duration-300 ease-in-out group-hover:scale-110`}
                height={32}
                width={32}
              />
              <Image
                src="/favicon.svg"
                className={`absolute top-0 right-0 transition-all duration-300 ease-in-out group-hover:scale-110 ${
                  managementTheme === "zimo" ? "opacity-0" : "opacity-100"
                }`}
                alt="Change theme"
                height={32}
                width={32}
              />
            </button>
          </div>
          <nav className="mb-4 flex items-center md:justify-end px-8 md:px-36">
            <div className="w-full">
              <BlogSearchBox
                keyword="management article"
                theme={managementTheme}
              />
            </div>
          </nav>
          <ArticleCardGrid posts={posts} theme={managementTheme} />
        </section>
      </BlogSearchProvider>
    </MainPageLayout>
  );
};

export default ManagementLayout;
