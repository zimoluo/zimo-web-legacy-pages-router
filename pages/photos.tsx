import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import PhotosTileGrid from "@/components/photos/PhotosTileGrid";
import { getAllEntries } from "@/lib/aws-api";

const filePath = "photos/entries";

type Props = {
  allEntries: PhotosData[];
};

export default function Home({ allEntries }: Props) {
  return (
    <MainPageLayout theme="photos">
      <MainPageTitle
        title="Album of Things, Album of Life."
        subtitle="Photos, just like names, comprise the soul."
      />
      <PhotosTileGrid photoEntries={allEntries} />
    </MainPageLayout>
  );
}

export const getStaticProps = async () => {
  // Get all entries
  const allEntries = await getAllEntries(filePath, [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
  ]);

  return {
    props: { allEntries },
    revalidate: 25,
  };
};
