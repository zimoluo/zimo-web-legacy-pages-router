import MainPageLayout from '@/components/MainPageLayout'
import MainPageTitle from '@/components/MainPageTitle'
import ProjectTileGrid from '@/components/projects/ProjectTileGrid';
import ProjectData from '@/interfaces/projects/projectData';
import { getAllEntries } from '@/lib/aws-api'
import { markdownToHtml, updateImageAttributes } from '@/lib/util';

const filePath = 'projects/entries';

type Props = {
  allEntries: ProjectData[]
}

export default function Home({ allEntries }: Props) {
  return (
    <MainPageLayout theme='projects'>
      <MainPageTitle title='Machina et Artes, Manus Dei Hominum.' subtitle='Light emits from the power of creation.'/>
      <ProjectTileGrid entries={allEntries} />
    </MainPageLayout>
  )
}

export const getStaticProps = async () => {
  // Get all entries
  const entries = await getAllEntries(filePath, [
    'title',
    'slug',
    'description',
    'links',
    'date',
    'authors',
    'faviconFormat',
    'content',
    'images',
  ]);

  // Process each entry
  const allEntries = await Promise.all(
    entries.map(async (entry) => {
      const content = updateImageAttributes(await markdownToHtml(entry.content.join('\n') || ''));
      return {
        ...entry,
        content,
      };
    })
  );

  return {
      props: {allEntries},
      revalidate: 45,
  };
};
