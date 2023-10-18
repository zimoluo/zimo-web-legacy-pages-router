import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import ProjectTileGrid from "@/components/projects/ProjectTileGrid";
import ProjectData from "@/interfaces/projects/projectData";
import { getAllEntries } from "@/lib/aws-api";

const filePath = "projects/entries";

type Props = {
  allEntries: ProjectData[];
};

export default function Home({ allEntries }: Props) {
  return (
    <MainPageLayout theme="projects">
      <MainPageTitle
        title="Machina et Artes, Manus Dei Hominum."
        subtitle="Light emits from the power of creation."
      />
      <ProjectTileGrid entries={Array(50).fill(null).flatMap(() => allEntries)} />
    </MainPageLayout>
  );
}

export const getStaticProps = async () => {
  // Get all entries
  const entries = await getAllEntries(filePath, [
    "title",
    "slug",
    "description",
    "links",
    "date",
    "authors",
    "faviconFormat",
    "content",
    "images",
    "unlisted",
  ]);

  // Process each entry
  const allEntries = await Promise.all(
    entries.map(async (entry) => {
      const content = entry.content.join("\n") || "";
      return {
        ...entry,
        content,
      };
    })
  );

  const filteredEntries = allEntries.filter(
    (entry) => !(entry as any).unlisted
  );

  return {
    props: { allEntries: filteredEntries },
    revalidate: 25,
  };
};
