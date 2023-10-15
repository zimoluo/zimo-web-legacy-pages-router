import MainPageLayout from "@/components/MainPageLayout";
import ProjectData from "@/interfaces/projects/projectData";
import { getProjectFavicon } from "@/lib/projects/util";
import Head from "next/head";
import ReadingBlur from "@/components/ReadingBlur";
import { getAllEntries, getEntryBySlug } from "@/lib/aws-api";
import ProjectMain from "@/components/projects/ProjectMain";
import { restoreDisplayText } from "@/lib/util";

type ProjectType = {
  entry: ProjectData;
};

const filePath = "projects/entries";

export default function Entry({ entry }: ProjectType) {
  const title = `${entry.title} | Projects - Zimo`;
  const favicon = getProjectFavicon(entry.slug, entry.faviconFormat);

  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/${entry.slug}`
      : "";

  return (
    <MainPageLayout theme="projects">
      <Head>
        <title>{title}</title>
        <meta
          property="og:image"
          content={favicon ? favicon : "/projects-zimo.svg"}
        />
        <meta property="og:type" content="article" />
        <meta property="og:image:alt" content={`Cover of ${entry.title}`} />
        <meta property="og:title" content={entry.title} />
        <meta
          property="og:description"
          content={restoreDisplayText(entry.description)}
        />
        <meta property="og:url" content={urlShare} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WhiteGkings" />
        <meta
          name="twitter:image"
          content={favicon ? favicon : "/projects-zimo.svg"}
        />
        <meta name="twitter:image:alt" content={`Cover of ${entry.title}`} />
        <meta name="twitter:title" content={entry.title} />
        <meta
          name="twitter:description"
          content={restoreDisplayText(entry.description)}
        />

        <meta
          name="description"
          content={restoreDisplayText(entry.description)}
        />
        <meta name="author" content={entry.authors.join(", ")} />
        <meta
          name="keywords"
          content="Zimo,Project,Coding,Programming,Personal Website"
        />
        <link rel="canonical" href={urlShare} />
      </Head>
      <ReadingBlur />
      <ProjectMain {...entry} />
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
    "slug",
    "description",
    "links",
    "date",
    "authors",
    "faviconFormat",
    "content",
    "images",
  ]);
  const content = entry.content.join("\n") || "";
  return {
    props: {
      entry: {
        ...entry,
        content,
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
    fallback: "blocking",
  };
}
