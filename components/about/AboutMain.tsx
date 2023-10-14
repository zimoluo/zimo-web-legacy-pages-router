import AboutContent from "./AboutContent";
import AboutHeader from "./AboutHeader";
import ShareButton from "../ShareButton";
import { useRouter } from "next/router";
import { getFullMarkdown } from "@/lib/about/util";

const AboutMain = ({
  title,
  description,
  content,
  date,
  slug,
  isIndex = false,
}: AboutData & { isIndex?: boolean }) => {
  const router = useRouter();
  const urlShare =
    typeof window !== "undefined"
      ? `${window.location.origin}${router.asPath}`
      : "";

  return (
    <div className="flex justify-center items-center">
      <article
        className={`relative mt-16 md:mt-20 md:mb-20 md:mx-8 px-8 w-full ${
          isIndex ? "bg-neutral-50" : "bg-color-about-opaque bg-center bg-cover"
        } bg-opacity-90 md:bg-opacity-80 md:blog-view-middle md:px-14 pb-12 pt-16 md:rounded-3xl md:shadow-xl`}
      >
        <div className="absolute top-4 right-5 z-10 flex items-center space-x-2">
          <ShareButton
            title={title}
            description={getFullMarkdown(content, title, date, description)}
            url={urlShare}
            platform="downloadPdf"
            theme={isIndex ? "zimo" : "about"}
          />
          <ShareButton
            title=""
            description=""
            url={urlShare}
            platform="copy"
            theme={isIndex ? "zimo" : "about"}
          />
        </div>
        <AboutHeader
          title={title}
          description={description}
          isIndex={isIndex}
          date={date}
        />
        <div
          className={`my-10 ${
            isIndex ? "border-neutral-700" : "border-sky-700"
          } border-t opacity-50`}
        />
        <AboutContent content={content} isIndex={isIndex} />
      </article>
    </div>
  );
};

export default AboutMain;
