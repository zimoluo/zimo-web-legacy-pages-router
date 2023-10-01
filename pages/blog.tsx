import MainPageLayout from '@/components/MainPageLayout'
import MainPageTitle from '@/components/MainPageTitle'
import BlogCardGrid from '@/components/blog/BlogCardGrid'
import PostData from '@/interfaces/blog/postData'
import { getAllPosts } from '@/lib/blog/aws-api'

type Props = {
  allPosts: PostData[]
}

export default function Home({ allPosts }: Props) {
  return (
    <MainPageLayout theme='blog'>
      <MainPageTitle title='State and Flow of Mind.' subtitle='Welcome, my friend. I have been expecting you.'/>
      <BlogCardGrid posts={allPosts}/>
    </MainPageLayout>
  )
}

export const getStaticProps = async () => {
  const allPosts = await getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
    'description',
    'authorId',
  ])

  return {
    props: { allPosts },
    revalidate: 25,
  }
}
