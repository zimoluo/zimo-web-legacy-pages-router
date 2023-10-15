import Image from "next/image";
import { getAuthorImageSrc, readingTime } from "@/lib/blog/util";
import Link from "next/link";
import { enrichTextContent, formatDate, imageFallback } from "@/lib/util";
import { useBlogSearch } from "../contexts/BlogSearchContext";

const BlogCard = ({
  title,
  date,
  coverImage,
  author,
  authorId,
  description,
  content,
  slug,
  tags = [],
}: PostData) => {
  const readTime = readingTime(content);
  const postDate = formatDate(date);

  const { setBlogSearchContent } = useBlogSearch();

  return (
    <Link href={`/blog/${slug}`}>
      <div className="px-4 py-4 rounded-xl backdrop-blur-md shadow-lg blog-card-color">
        <div className="flex flex-row">
          <div className="flex flex-col flex-grow">
            <div className="flex flex-row items-center">
              <div className="rounded-full overflow-hidden h-6 w-fit flex justify-center items-center">
                <Image
                  src={`${getAuthorImageSrc(authorId)}`}
                  alt={`${author}'s Profile. What follows next is the name of the author. The h2 element after the author's name is the title.`}
                  className="h-full w-fit"
                  width={25}
                  height={25}
                  onError={imageFallback("/blog-zimo.svg")}
                />
              </div>
              <div className="ml-2 text-sm font-bold">{author}</div>
            </div>

            <h2 className="mt-3 text-md md:text-2xl font-bold">{title}</h2>

            <h3 className="hidden md:block text-lg text-fuchsia-800 opacity-70">
              {enrichTextContent(description)}
            </h3>

            <div className="flex-grow"></div>

            <p className="text-sm text-fuchsia-800 opacity-70">
              {`${postDate}  ·  ${readTime}`}
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-auto h-28 md:h-36 ml-2 rounded-xl overflow-hidden max-w-60 md:max-w-80">
              <Image
                className="h-full w-auto object-cover"
                src={coverImage}
                alt={`Cover of ${title}`}
                width={320}
                height={320}
                onError={imageFallback("/blog-fallback.svg")}
              />
            </div>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="opacity-70 mt-1.5 md:mt-2.5">
            {tags.map((tag, index) => (
              <button
                key={index}
                className="mr-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  setBlogSearchContent(`#${tag}`);
                }}
              >
                <span className="inline-block bg-fuchsia-700 rounded-full px-2 py-0.25 md:py-0.5 text-xs md:text-sm font-bold text-fuchsia-50 transition-transform duration-300 ease-in-out hover:scale-105 text-center">
                  {tag}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
