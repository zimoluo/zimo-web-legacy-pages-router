import MainPageLayout from "@/components/MainPageLayout"
import ProjectData from "@/interfaces/projects/projectData";
import { getProjectFavicon } from "@/lib/projects/util";
import markdownToHtml from "@/lib/util";
import Head from 'next/head';
import ReadingBlur from "@/components/ReadingBlur";
import ProjectTextSide from "@/components/projects/ProjectTextSide";
import { getAllEntries, getEntryBySlug } from "@/lib/api";
import ProjectImages from "@/components/projects/ProjectImages";
import ProjectMain from "@/components/projects/ProjectMain";

type ProjectType = {
    entry: ProjectData
}

const filePath = 'projects/entries';

export default function Entry({ entry }: ProjectType) {
    const title = `${entry.title} | Blog - Zimo`
    const favicon = getProjectFavicon(entry.slug, entry.faviconFormat);

    return (
      <MainPageLayout theme='projects' >
            <Head>
                <title>{title}</title>
                <meta property="og:image" content={favicon ? favicon : '/projects-zimo.svg'} />
            </Head>
            <ReadingBlur />
            <ProjectMain entry={entry} />
      </MainPageLayout>
    )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const entry = await getEntryBySlug(params.slug, filePath, [
    'title', 
    'slug', 
    'description', 
    'links', 
    'date', 
    'authors' , 
    'faviconFormat', 
    'content',
    'images',
  ])
  const content = await markdownToHtml(entry.content.join('\n') || '')

  return {
    props: {
      entry: {
        ...entry,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const entries = await getAllEntries(filePath, ['slug'])

  return {
    paths: entries.map((entry) => {
      return {
        params: {
          slug: entry.slug,
        },
      }
    }),
    fallback: false,
  }
}
