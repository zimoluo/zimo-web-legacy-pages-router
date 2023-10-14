import dayjs from "dayjs";
import { marked } from "marked";
import { downloadCss } from "./downloadCss";

export function downloadHtml(
  markdown: string,
  title: string = "Downloaded Document"
) {
  try {
    const html = marked(markdown);

    const fullHtml = `<html><head><meta charset="UTF-8"><style>${downloadCss}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body>${html}</body></html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.html`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error:", error);
  }
}

export function getFullMarkdown(
  content: string,
  title: string,
  date: string,
  description: string = ""
) {
  return `# ${title}\n\n### ${calendarDate(date)}\n\n${
    description ? `${description}\n\n` : ""
  }\n\n------${content}`;
}

export const calendarDate = (dateStr: string) => {
  const eventDate = dayjs(dateStr);
  return eventDate.format("MMM D, YYYY");
};
