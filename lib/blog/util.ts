import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { SyntheticEvent } from 'react';
import { awsBucketAddress } from '../constants';
import { marked } from 'marked';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export default async function markdownToHtml(markdown: string) {
  const htmlContent = marked(markdown);
  return htmlContent;
};

export const getAuthorImageSrc = (authorId: string): string => {
    return `${awsBucketAddress}/blog/author/${authorId}`;
};

export const getCoverSrc = (coverImage: string, slug: string): string => {
  if (!(coverImage)) {
    return '';
  }

  if (!(coverImage.startsWith('/'))) {
    return coverImage;
  }

  const strippedPath = coverImage.substring(1);
  const newPath = `${awsBucketAddress}/blog/posts/${slug}/${strippedPath}`;

  return newPath;
};

export const formatDate = (dateStr: string) => {
  const today = dayjs();
  const eventDate = dayjs(dateStr);

  const daysDifference = today.diff(eventDate, 'day');
  const hoursDifference = today.diff(eventDate, 'hour');
  const minutesDifference = today.diff(eventDate, 'minute');

  if (minutesDifference < 0) {
    return 'In the future';
  }

  if (minutesDifference <= 1) {
    return 'Just now';
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'} ago`;
  }

  if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference === 1 ? '' : 's'} ago`;
  }

  if (daysDifference < 15) {
    return `${daysDifference} day${daysDifference === 1 ? '' : 's'} ago`;
  }

  return eventDate.format('MMM D, YYYY');
};

export const readingTime = (content: string) => {
  const wordCount = content.split(/\s/).length;
  const totalMinutes = Math.ceil(wordCount / 238);

  if (totalMinutes >= 1440) { // 1440 minutes in a day
    return "You don't wanna read this";
  }

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours} hr${hours === 1 ? '' : 's'} read`;
    }
    
    return `${hours} hr${hours === 1 ? '' : 's'} ${minutes} min read`;
  }

  return `${totalMinutes} min read`;
};

export const imageFallback = (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  
  // Set to fallback source
  target.src = fallbackSrc;
  target.srcset = fallbackSrc;
};