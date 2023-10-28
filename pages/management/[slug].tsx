import MainPageLayout from "@/components/MainPageLayout";
import ReadingBlur from "@/components/ReadingBlur";
import AboutMain from "@/components/about/AboutMain";
import { useSettings } from "@/components/contexts/SettingsContext";
import { getAllPosts, getPostBySlug } from "@/lib/about/aws-api";
import Head from "next/head";
type PostType = {
  post: PostData & { displayCover: boolean; originalContent: string };
};

export default function Post({ post }: PostType) {
  const title = `${post.title} | Management - Zimo Web`;

  const { settings } = useSettings();

  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}/management/${post.slug}`
      : "";

  return (
    <MainPageLayout theme={settings.preferredManagementTheme}>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:image" content={"/favicon.svg"} />
        <meta property="og:image:alt" content={`Cover of ${post.title}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={urlShare} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WhiteGkings" />
        <meta name="twitter:image" content={"/favicon.svg"} />
        <meta name="twitter:image:alt" content={`Cover of ${post.title}`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />

        <meta name="description" content={post.description} />
        <meta name="author" content={post.author} />
        <meta
          name="keywords"
          content="Zimo,Personal Website,Policy,Management"
        />
        <link rel="canonical" href={urlShare} />
      </Head>
      <ReadingBlur />
      <AboutMain
        title={post.title}
        description={post.description}
        content={post.content}
        date={post.date}
        slug={post.slug}
        isIndex={settings.preferredManagementTheme === "zimo"}
      ></AboutMain>
    </MainPageLayout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = await getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "content",
    "description",
  ]);

  return {
    props: {
      post: {
        ...post,
      },
    },
    revalidate: 25,
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: "blocking",
  };
}
