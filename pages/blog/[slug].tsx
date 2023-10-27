import MainPageLayout from "@/components/MainPageLayout";
import BlogMainLayout from "@/components/blog/BlogMainLayout";
import ReadingBlur from "@/components/ReadingBlur";
import { getAllPosts, getPostBySlug } from "@/lib/blog/aws-api";
import { getCoverSrc } from "@/lib/blog/util";
import Head from "next/head";
import { restoreDisplayText } from "@/lib/util";
type PostType = {
  post: PostData & {
    displayCover: boolean;
    originalContent: string;
    compatibleCover?: string;
  };
};

export default function Post({ post }: PostType) {
  const title = `${post.title} | Blog - Zimo`;
  const coverSrc =
    post.compatibleCover ||
    getCoverSrc(post.coverImage, post.slug) ||
    "/blog-zimo.svg";

  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${post.slug}`
      : "";

  return (
    <MainPageLayout theme="blog">
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:image" content={coverSrc} />
        <meta property="og:image:alt" content={`Cover of ${post.title}`} />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={restoreDisplayText(post.description)}
        />
        <meta property="og:url" content={urlShare} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WhiteGkings" />
        <meta name="twitter:image" content={coverSrc} />
        <meta name="twitter:image:alt" content={`Cover of ${post.title}`} />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={restoreDisplayText(post.description)}
        />

        <meta
          name="description"
          content={restoreDisplayText(post.description)}
        />
        <meta name="author" content={post.author} />
        <meta name="keywords" content="Zimo,Blog,Personal Website" />
        <link rel="canonical" href={urlShare} />
      </Head>
      <ReadingBlur />
      <BlogMainLayout
        title={post.title}
        description={post.description}
        authorId={post.authorId}
        author={post.author}
        content={post.content}
        date={post.date}
        coverSrc={coverSrc}
        displayCover={post.displayCover}
        slug={post.slug}
        tags={post.tags}
      ></BlogMainLayout>
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
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "displayCover",
    "tags",
    "compatibleCover",
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
