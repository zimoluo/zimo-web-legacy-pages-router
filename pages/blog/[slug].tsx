import MainPageLayout from "@/components/MainPageLayout"
import BlogMainLayout from "@/components/blog/BlogMainLayout";
import BlogReadingBlur from "@/components/blog/BlogReadingBlur";
import PostData from "@/interfaces/blog/postData"
import { getAllPosts, getPostBySlug } from "@/lib/blog/api";
import markdownToHtml, { getCoverSrc } from "@/lib/blog/util";
import Head from 'next/head';

type PostType = {
    post: PostData
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
            <BlogReadingBlur></BlogReadingBlur>
            <BlogMainLayout
              title={post.title}
              description={post.description}
              authorId={post.authorId}
              author={post.author}
              content={post.content}
              date={post.date}
              coverSrc={coverSrc}
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
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
    'description',
    'authorId',
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
  const posts = getAllPosts(['slug'])

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
