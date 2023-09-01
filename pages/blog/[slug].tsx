import MainPageLayout from "@/components/MainPageLayout"
import BlogMainLayout from "@/components/blog/BlogMainLayout";
import ReadingBlur from "@/components/ReadingBlur";
import PostData from "@/interfaces/blog/postData"
import { getAllPosts, getPostBySlug } from "@/lib/blog/api";
import { getCoverSrc } from "@/lib/blog/util";
import markdownToHtml from "@/lib/util";
import Head from 'next/head';

type PostType = {
    post: PostData & { displayCover: boolean }
}

export default function Post({ post }: PostType) {
    const title = `${post.title} | Blog - Zimo`
    const coverSrc = getCoverSrc(post.coverImage, post.slug);

    return (
      <MainPageLayout theme='blog' >
            <Head>
                <title>{title}</title>
                <meta property="og:image" content={coverSrc ? coverSrc : '/blog-zimo.svg'} />
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
            ></BlogMainLayout>
      </MainPageLayout>
    )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = await getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
    'description',
    'authorId',
    'displayCover'
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
