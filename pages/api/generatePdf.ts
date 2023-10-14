import puppeteer from "puppeteer";
import { marked } from "marked";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { markdown } = req.body;

  try {
    // Convert Markdown to HTML
    const html = marked(markdown);

    const cssPath = path.resolve("./styles/pdf-markdown.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    const fullHtml = `<html><head><style>${css}</style></head><body>${html}</body></html>`;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(fullHtml, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=download.pdf");

    res.end(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
