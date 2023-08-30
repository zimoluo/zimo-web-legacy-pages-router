import Image from "next/image";
import { formatDate, getAuthorImageSrc, imageFallback, readingTime } from "@/lib/blog/util";
import Link from "next/link";
import PostData from "@/interfaces/blog/postData";

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
    <div className="flex flex-row px-4 py-4 rounded-xl backdrop-blur-md shadow-lg blog-card-color">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row items-center">
          <Image
            src={`${getAuthorImageSrc(authorId)}`}
            alt={`${author}'s Profile`}
            className="h-6 w-fit"
            width={25}
            height={25}
            onError={imageFallback('/blog-zimo.svg')}
          />
          <p className="ml-2 text-sm font-bold">{author}</p>
        </div>

        <Link href={`/blog/${slug}`}>
          <p className="mt-3 text-md md:text-2xl font-bold">{title}</p>

          <p className="hidden md:block text-lg text-fuchsia-800 opacity-70">
            {description}
          </p>
        </Link>

        <div className="flex-grow"></div>

        <p className="mt-2 text-sm text-fuchsia-800 opacity-70">{`${postDate}  ·  ${readTime}`}</p>
      </div>

      <div className="flex items-center">
        <div className="w-auto h-28 md:h-36 ml-2 rounded-xl overflow-hidden">
          <Image
            className="h-full w-auto object-cover"
            src={coverImage}
            alt={`Cover of ${title}`}
            width={128}
            height={80}
            onError={imageFallback('/blog-fallback.svg')}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
