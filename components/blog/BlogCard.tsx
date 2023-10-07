import Image from "next/image";
import { getAuthorImageSrc, readingTime } from "@/lib/blog/util";
import Link from "next/link";
import PostData from "@/interfaces/blog/postData";
import { enrichTextContent, formatDate, imageFallback } from "@/lib/util";

const BlogCard = ({
  title,
  date,
  coverImage,
  author,
  authorId,
  description,
  content,
  slug,
}: PostData) => {
  const readTime = readingTime(content);
  const postDate = formatDate(date);

  return (
    <Link href={`/blog/${slug}`}>
      <div className="flex flex-row px-4 py-4 rounded-xl backdrop-blur-md shadow-lg blog-card-color">
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row items-center">
            <div className="rounded-full overflow-hidden h-6 w-fit flex justify-center items-center">
              <Image
                src={`${getAuthorImageSrc(authorId)}`}
                alt={`${author}'s Profile`}
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

          <p className="mt-2 text-sm text-fuchsia-800 opacity-70">{`${postDate}  ·  ${readTime}`}</p>
        </div>

        <div className="flex items-center">
          <div className="w-auto h-28 md:h-36 ml-2 rounded-xl overflow-hidden max-w-60 md:max-w-80">
            <Image
              className="h-full w-auto object-cover"
              src={coverImage}
              alt={`Cover of ${title}`}
              width={320}
              height={144}
              onError={imageFallback("/blog-fallback.svg")}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
