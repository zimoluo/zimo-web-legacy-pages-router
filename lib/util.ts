import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { SyntheticEvent } from 'react';
import { marked } from 'marked';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const imageFallback = (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    
    // Set to fallback source
    target.src = fallbackSrc;
    target.srcset = fallbackSrc;
  };
  
const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  
const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)
  
export const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

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

export default async function markdownToHtml(markdown: string) {
    const htmlContent = marked(markdown);
    return htmlContent;
};