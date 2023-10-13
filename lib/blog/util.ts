import { awsBucketAddress } from "../constants";

export const getAuthorImageSrc = (authorId: string): string => {
  if (authorId === "zimo") {
    return "/favicon.svg";
  }

  return `${awsBucketAddress}/blog/author/${authorId}`;
};

export const getCoverSrc = (coverImage: string, slug: string): string => {
  if (!coverImage) {
    return "";
  }

  if (!coverImage.startsWith("/")) {
    return coverImage;
  }

  const strippedPath = coverImage.substring(1);
  const newPath = `${awsBucketAddress}/blog/posts/${slug}/${strippedPath}`;

  return newPath;
};

export const readingTime = (content: string) => {
  // Remove all blocks of text between && and && or && and a line break.
  const cleanedContent = content.replace(/&&[^&&]*&&|&&[^&&]*\n/g, "");

  // Split the cleaned content into words, filtering out any non-word characters.
  const words = cleanedContent.split(/\b\S+\b/g).filter(Boolean);

  // Calculate reading time based on word count.
  const wordCount = words.length;
  const totalMinutes = Math.ceil(wordCount / 238);

  if (totalMinutes >= 1440) {
    // 1440 minutes in a day
    return "You don't wanna read this";
  }

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} hr${hours === 1 ? "" : "s"} read`;
    }

    return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min read`;
  }

  return `${totalMinutes} min read`;
};
