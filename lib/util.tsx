import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { ReactNode, SyntheticEvent } from "react";
import { remark } from "remark";
import html from "remark-html";
import React from "react";

let JSDOM: typeof import("jsdom").JSDOM | null = null;

if (typeof window === "undefined") {
  JSDOM = require("jsdom").JSDOM;
}

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const imageFallback =
  (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;

    // Set to fallback source
    target.src = fallbackSrc;
    target.srcset = fallbackSrc;
  };

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const rgbaDataURL = (r: number, g: number, b: number, a: number) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="100%" height="100%" fill="rgba(${r},${g},${b},${a})"/></svg>`;
  const base64 = btoa(svgString);
  return `data:image/svg+xml;base64,${base64}`;
};

export const shimmerDataURL = (w: number, h: number) =>
  toBase64(`
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#888" offset="20%" />
      <stop stop-color="#777" offset="50%" />
      <stop stop-color="#888" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#888" opacity="0.75" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0.75" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`);

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const formatDate = (dateStr: string) => {
  const today = dayjs();
  const eventDate = dayjs(dateStr);

  const daysDifference = today.diff(eventDate, "day");
  const hoursDifference = today.diff(eventDate, "hour");
  const minutesDifference = today.diff(eventDate, "minute");

  if (minutesDifference < 0) {
    return "In the future";
  }

  if (minutesDifference <= 0) {
    return "Just now";
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  }

  if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
  }

  if (daysDifference < 15) {
    return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
  }

  return eventDate.format("MMM D, YYYY");
};

export async function standardMarkdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export const formatAltText = (key: string) => {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const applyImageViewerTransition = (
  element: HTMLElement,
  transform: string,
  duration: number,
  onComplete: () => void
) => {
  element.style.transition = `transform ${duration}s ease-out`;
  element.style.transform = transform;

  const onTransitionEnd = () => {
    element.style.transition = "none";
    element.removeEventListener("transitionend", onTransitionEnd);
    onComplete();
  };

  element.addEventListener("transitionend", onTransitionEnd);
};

export function imagesParser(input: ImagesData): ImagesData {
  const { url, text = [], aspectRatio, original } = input;
  let outputText: string[] = [];

  const urlLength = url.length;
  const textLength = text.length;

  if (urlLength === textLength) {
    outputText = text;
  } else if (textLength > urlLength) {
    outputText = text.slice(0, urlLength);
  } else {
    outputText = [...text, ...new Array(urlLength - textLength).fill("")];
  }

  const safeOriginal: string[] = original
    ? original.length === url.length // if lengths are equal, use original
      ? original
      : original.length < url.length // if original is shorter, append empty strings
      ? [...original, ...new Array(url.length - original.length).fill("")]
      : original.slice(0, url.length) // if original is longer, clip it to match url's length
    : new Array(url.length).fill("");

  return {
    url,
    text: outputText,
    aspectRatio,
    original: safeOriginal,
  };
}

export const calculateGridViewTransformStyle = (
  index: number,
  gridLength: number
) => {
  return `translate(${
    ((index % gridLength) / gridLength - 0.5 + 0.5 / gridLength) * 100
  }%, ${
    (Math.floor(index / gridLength) / gridLength - 0.5 + 0.5 / gridLength) * 100
  }%) scale(${1 / gridLength - 0.008})`;
};

// Global state to keep track of active popups
let activePopups: any[] = [];

// Function to add a popup to the active popups list
export const addActivePopup = (popupInstance: any): void => {
  activePopups.push(popupInstance);
};

// Function to remove a popup from the active popups list
export const removeActivePopup = (popupInstance: any): void => {
  const index = activePopups.indexOf(popupInstance);
  if (index !== -1) {
    activePopups.splice(index, 1);
  }
};

// Function to check if the popup is the current active one
export const isActivePopup = (popupInstance: any): boolean => {
  return (
    activePopups.length > 0 &&
    activePopups[activePopups.length - 1] === popupInstance
  );
};

// Function to clear all active popups (use with caution)
export const clearActivePopups = (): void => {
  activePopups = [];
};

export function formatLocation(location: LocationData): string {
  if (location.name) {
    return location.name.trim();
  }

  let lat: string = location.latitude.toFixed(2);
  let long: string = location.longitude.toFixed(2);

  // To handle the case where one of them has fewer decimal points.
  const latDecimalPoints = (location.latitude.toString().split(".")[1] || "")
    .length;
  const longDecimalPoints = (location.longitude.toString().split(".")[1] || "")
    .length;
  const decimalPoints = Math.min(latDecimalPoints, longDecimalPoints, 2);

  lat = location.latitude.toFixed(decimalPoints);
  long = location.longitude.toFixed(decimalPoints);

  const latDirection = location.latitude >= 0 ? "N" : "S";
  const longDirection = location.longitude >= 0 ? "E" : "W";

  return `${Math.abs(parseFloat(lat))}°${latDirection}, ${Math.abs(
    parseFloat(long)
  )}°${longDirection}`;
}

export const enrichTextContent = (content: string): ReactNode[] => {
  // Add a pattern to escape backticks
  const escapedContent = content.replace(/\\([*`])/g, "%%ESCAPED_$1%%");

  const splitContent = escapedContent.split(
    /(\*\*.*?\*\*|\*.*?\*|~~\{.*?\}\{.*?\}~~|`.*?`)/g
  );

  return splitContent.map((chunk, index) => {
    // Restore escaped characters
    const restoredChunk = chunk.replace(/%%ESCAPED_([*`])%%/g, "$1");

    if (/^\*\*(.*?)\*\*$/.test(restoredChunk)) {
      return <strong key={index}>{restoredChunk.slice(2, -2)}</strong>;
    }
    if (/^\*(.*?)\*$/.test(restoredChunk)) {
      return <em key={index}>{restoredChunk.slice(1, -1)}</em>;
    }
    const linkMatch = restoredChunk.match(/^~~\{(.*?)\}\{(.*?)\}~~$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          className="underline underline-offset-2"
          target="_blank"
        >
          {linkMatch[1]}
        </a>
      );
    }
    const codeMatch = restoredChunk.match(/^`(.*?)`$/);
    if (codeMatch) {
      return <code key={index}>{codeMatch[1]}</code>;
    }
    return <React.Fragment key={index}>{restoredChunk}</React.Fragment>;
  });
};

export const restoreDisplayText = (content: string): string => {
  // Step 1: Replace escaped asterisks and backticks
  const escapedContent = content.replace(/\\([*`])/g, "%%ESCAPED_$1%%");

  // Step 2: Remove patterns and retrieve the display text
  const withoutBold = escapedContent.replace(/\*\*(.*?)\*\*/g, "$1");
  const withoutItalic = withoutBold.replace(/\*(.*?)\*/g, "$1");
  const withoutLinks = withoutItalic.replace(/~~\{(.*?)\}\{(.*?)\}~~/g, "$1");
  const withoutCode = withoutLinks.replace(/`(.*?)`/g, "$1");

  // Step 3: Restore escaped asterisks and backticks
  const restoredContent = withoutCode.replace(/%%ESCAPED_([*`])%%/g, "$1");

  return restoredContent;
};
