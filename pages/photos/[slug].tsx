import MainPageLayout from "@/components/MainPageLayout";
import Head from "next/head";
import ReadingBlur from "@/components/ReadingBlur";
import { getAllEntries, getEntryBySlug } from "@/lib/aws-api";
import PhotosMain from "@/components/photos/PhotosMain";

type Props = {
  entry: PhotosData;
};

const filePath = "photos/entries";

export default function Entry({ entry }: Props) {
  const title = `${entry.title} | Album - Zimo`;

  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}/photos/${entry.slug}`
      : "";

  return (
    <MainPageLayout theme="photos">
      <Head>
        <title>{title}</title>
        <meta property="og:image" content="/photos-zimo.svg" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={entry.title} />
        <meta property="og:url" content={urlShare} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WhiteGkings" />
        <meta name="twitter:image" content="/photos-zimo.svg" />
        <meta name="twitter:image:alt" content={`${entry.title}`} />
        <meta name="twitter:title" content={entry.title} />
        <meta name="author" content={entry.author} />
        <meta name="keywords" content="Zimo,Photos,Album,Personal Website" />
        <link rel="canonical" href={urlShare} />
      </Head>
      <ReadingBlur />
      <PhotosMain {...entry} />
    </MainPageLayout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const entry = await getEntryBySlug(params.slug, filePath, [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
  ]);

  return {
    props: {
      entry: {
        ...entry,
      },
    },
    revalidate: 25,
  };
}

export async function getStaticPaths() {
  const entries = await getAllEntries(filePath, ["slug"]);

  return {
    paths: entries.map((entry) => {
      return {
        params: {
          slug: entry.slug,
        },
      };
    }),
    fallback: false,
  };
}
