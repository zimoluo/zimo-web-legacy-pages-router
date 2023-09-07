import Image from "next/image";
import { formatAltText, formatDate, imageFallback } from "@/lib/util";
import { getProjectFavicon } from "@/lib/projects/util";

type Props = {
  title: string;
  description: string;
  links: { [key: string]: string };
  date: string;
  authors: string[];
  slug: string;
  faviconFormat: string;
};

const ProjectsTitleCard = ({
  title,
  description,
  links,
  date,
  authors,
  slug,
  faviconFormat,
}: Props) => {
  return (
    <div className="my-10">
      <div className="mb-2">
        <h1 className="font-bold text-4xl text-teal-900 leading-relaxed">
          {title}
        </h1>
        <p className="text-xl text-teal-800 opacity-70 mt-4 mb-10 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex h-16">
        <div className="flex justify-start items-center">
          <div className="flex items-center justify-center h-14 w-auto mr-5">
            <Image
              className="h-full w-auto"
              height={56}
              width={56}
              alt="Project Favicon"
              src={getProjectFavicon(slug, faviconFormat)}
              onError={imageFallback("/projects-zimo.svg")}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-bold items-end justify-start flex">
              {authors.join(", ")}
            </div>
            <div className="text-teal-800 text-md opacity-70 items-end justify-start flex">
              {formatDate(date)}
            </div>
          </div>
        </div>
        <div className="flex-col flex-grow">
          <div className="flex-grow" />
          <div className="flex items-end justify-end h-full">
            {Object.keys(links).map((key, index) => (
              <a
                key={index}
                href={
                  key === "zimo-blog"
                    ? `/blog/${links[key]}`
                    : key === "github"
                    ? `https://github.com/${links[key]}`
                    : links[key]
                }
                target="_blank"
              >
                <Image
                  src={`/projects-link/${key}.svg`}
                  alt={formatAltText(key)}
                  className="h-6 w-auto ml-3"
                  height={24}
                  width={24}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={`my-2 border-teal-700 border-t opacity-50`} />
    </div>
  );
};

export default ProjectsTitleCard;
