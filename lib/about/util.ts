import dayjs from "dayjs";

export async function downloadPdf(
  markdown: string,
  title: string = "Downloaded Document"
) {
  try {
    const res = await fetch("/api/generatePdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate PDF");
    }

    const pdfBlob = await res.blob();
    const url = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;
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
