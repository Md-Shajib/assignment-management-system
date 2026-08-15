export const MARKDOWN_FORMATS = [
  "bold",
  "italic",
  "underline",
  "bulletList",
  "numberedList",
  "link",
] as const;

export type MarkdownFormat = (typeof MARKDOWN_FORMATS)[number];

export interface MarkdownEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

interface Wrapper {
  prefix: string;
  suffix: string;
  placeholder: string;
}

/** Markdown has no underline, so that one falls back to the inline HTML Markdown allows. */
const WRAPPERS: Record<"bold" | "italic" | "underline", Wrapper> = {
  bold: { prefix: "**", suffix: "**", placeholder: "bold text" },
  italic: { prefix: "*", suffix: "*", placeholder: "italic text" },
  underline: { prefix: "<u>", suffix: "</u>", placeholder: "underlined text" },
};

const LINK_PLACEHOLDER = "link text";
const LINK_URL = "https://";
const LIST_PLACEHOLDER = "List item";

function wrap(value: string, start: number, end: number, wrapper: Wrapper): MarkdownEdit {
  const selected = value.slice(start, end);
  const inner = selected || wrapper.placeholder;

  return {
    value: `${value.slice(0, start)}${wrapper.prefix}${inner}${wrapper.suffix}${value.slice(end)}`,
    selectionStart: start + wrapper.prefix.length,
    selectionEnd: start + wrapper.prefix.length + inner.length,
  };
}

function link(value: string, start: number, end: number): MarkdownEdit {
  const label = value.slice(start, end) || LINK_PLACEHOLDER;
  // Selects the URL so the next keystroke replaces the placeholder scheme.
  const urlStart = start + "[".length + label.length + "](".length;

  return {
    value: `${value.slice(0, start)}[${label}](${LINK_URL})${value.slice(end)}`,
    selectionStart: urlStart,
    selectionEnd: urlStart + LINK_URL.length,
  };
}

function list(value: string, start: number, end: number, ordered: boolean): MarkdownEdit {
  // Lists apply to whole lines, so the edit is widened to the lines the selection touches.
  const blockStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const blockEnd = nextBreak === -1 ? value.length : nextBreak;

  const lines = value.slice(blockStart, blockEnd).split("\n");
  const marked = lines
    .map((line, index) => {
      const marker = ordered ? `${index + 1}. ` : "- ";
      const content = line || (lines.length === 1 ? LIST_PLACEHOLDER : "");
      return content.startsWith(marker) ? content : `${marker}${content}`;
    })
    .join("\n");

  return {
    value: `${value.slice(0, blockStart)}${marked}${value.slice(blockEnd)}`,
    selectionStart: blockStart,
    selectionEnd: blockStart + marked.length,
  };
}

/**
 * Applies a formatting action to a text selection and reports where the caret
 * should land afterwards. Pure, so the editor component stays presentational.
 */
export function applyMarkdownFormat(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  format: MarkdownFormat,
): MarkdownEdit {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);

  switch (format) {
    case "bulletList":
      return list(value, start, end, false);
    case "numberedList":
      return list(value, start, end, true);
    case "link":
      return link(value, start, end);
    default:
      return wrap(value, start, end, WRAPPERS[format]);
  }
}
