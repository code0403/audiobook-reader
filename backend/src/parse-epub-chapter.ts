import * as cheerio from "cheerio";

export interface EpubParagraph {
  id: string | null;
  text: string;
}

export interface ParsedEpubChapter {
  title: string;
  paragraphs: EpubParagraph[];
}

export function parseEpubChapter(
  html: string
): ParsedEpubChapter {
  const $ = cheerio.load(html, {
    xmlMode: true,
  });

  const title = $("p.h3")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const paragraphs: EpubParagraph[] = [];

  $("p").each((_, element) => {
    const $element = $(element);

    // The chapter heading and title are not body paragraphs.
    if ($element.hasClass("h4") || $element.hasClass("h3")) {
      return;
    }

    const text = $element
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // Ignore empty/layout paragraphs.
    if (!text) {
      return;
    }

    paragraphs.push({
      id: $element.attr("id") ?? null,
      text,
    });
  });

  return {
    title,
    paragraphs,
  };
}