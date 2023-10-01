import MainPageLayout from "@/components/MainPageLayout";
import BlogMainLayout from "@/components/blog/BlogMainLayout";
import ReadingBlur from "@/components/ReadingBlur";
import PostData from "@/interfaces/blog/postData";
import { getAllPosts, getPostBySlug } from "@/lib/blog/aws-api";
import { getCoverSrc } from "@/lib/blog/util";
import { markdownToHtml, updateImageAttributes } from "@/lib/util";
import Head from "next/head";
type PostType = {
  post: PostData & { displayCover: boolean };
};

export default function Post({ post }: PostType) {
  const title = `${post.title} | Blog - Zimo`;
  const coverSrc = getCoverSrc(post.coverImage, post.slug);
  const updatedContent = updateImageAttributes(post.content);

  const urlShare = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';

  return (
    <MainPageLayout theme="blog">
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={coverSrc ? coverSrc : "/blog-zimo.svg"}
        />
        <meta property="og:image:alt" content={`Cover of ${post.title}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={urlShare} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WhiteGkings" />
        <meta
          name="twitter:image"
          content={coverSrc ? coverSrc : "/blog-zimo.svg"}
        />
        <meta name="twitter:image:alt" content={`Cover of ${post.title}`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />

        <meta name="description" content={post.description} />
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
        content={updatedContent}
        date={post.date}
        coverSrc={coverSrc}
        displayCover={post.displayCover}
        slug={post.slug}
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
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
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
    fallback: false,
  };
}
