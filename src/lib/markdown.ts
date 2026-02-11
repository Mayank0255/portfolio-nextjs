/**
 * Client-side markdown to HTML parser. Escapes HTML for safety, then applies
 * markdown rules. Use for rendering user/static content.
 */

const LINK_CLASS = "text-[var(--link-color)] hover:underline";
export const markdownProseClass =
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_p]:my-2 [&_pre]:bg-[var(--tag-bg)] [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:bg-[var(--tag-bg)] [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--card-border)] [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:text-[var(--text-muted)] [&_a]:text-[var(--link-color)] [&_a]:hover:underline [&_img]:max-w-full [&_img]:h-auto";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert markdown string to safe HTML. */
export function markdownToHtml(md: string): string {
  if (!md || typeof md !== "string") return "";
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  const linkRe = /\[([^\]]*)\]\(([^)]*)\)/g;
  const boldRe = /\*\*([^*]+)\*\*/g;
  const italicRe = /\*([^*]+)\*/g;
  const inlineCodeRe = /`([^`]+)`/g;

  const imgRe = /!\[([^\]]*)\]\(([^)]*)\)/g;
  function parseInline(text: string): string {
    let s = escapeHtml(text);
    // Images: allow https? and / only
    s = s.replace(imgRe, (_, alt, src) => {
      const safeSrc = src.startsWith("/") || /^https?:\/\//i.test(src) ? src : "";
      if (!safeSrc) return escapeHtml(alt || "image");
      return `<img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(alt || "")}" class="max-w-full h-auto rounded" loading="lazy" />`;
    });
    // Links (restore href safely)
    s = s.replace(linkRe, (_, label, href) => {
      const safeHref = href.startsWith("#") || href.startsWith("/") || /^https?:\/\//i.test(href) || href.startsWith("mailto:")
        ? href
        : "#";
      return `<a href="${escapeHtml(safeHref)}" class="${LINK_CLASS}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    });
    s = s.replace(boldRe, "<strong>$1</strong>");
    s = s.replace(italicRe, "<em>$1</em>");
    s = s.replace(inlineCodeRe, "<code class=\"bg-[var(--tag-bg)] px-1 rounded text-sm\">$1</code>");
    return s;
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim() || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      if (i < lines.length) i++;
      out.push(`<pre class="bg-[var(--tag-bg)] p-3 rounded-lg overflow-x-auto my-2"><code${lang ? ` class="language-${escapeHtml(lang)}"` : ""}>${codeLines.join("\n")}</code></pre>`);
      continue;
    }

    // Headings
    const h6 = trimmed.match(/^###### (.+)$/);
    const h5 = trimmed.match(/^##### (.+)$/);
    const h4 = trimmed.match(/^#### (.+)$/);
    const h3 = trimmed.match(/^### (.+)$/);
    const h2 = trimmed.match(/^## (.+)$/);
    const h1 = trimmed.match(/^# (.+)$/);
    if (h6) { out.push("<h6 class=\"text-base font-semibold mt-3 mb-1\">" + parseInline(h6[1]) + "</h6>"); i++; continue; }
    if (h5) { out.push("<h5 class=\"text-lg font-semibold mt-3 mb-1\">" + parseInline(h5[1]) + "</h5>"); i++; continue; }
    if (h4) { out.push("<h4 class=\"text-lg font-semibold mt-3 mb-1\">" + parseInline(h4[1]) + "</h4>"); i++; continue; }
    if (h3) { out.push("<h3 class=\"text-lg font-semibold mt-3 mb-1\">" + parseInline(h3[1]) + "</h3>"); i++; continue; }
    if (h2) { out.push("<h2 class=\"text-xl font-semibold mt-4 mb-2\">" + parseInline(h2[1]) + "</h2>"); i++; continue; }
    if (h1) { out.push("<h1 class=\"text-2xl font-bold mt-4 mb-2\">" + parseInline(h1[1]) + "</h1>"); i++; continue; }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith(">")) {
        quoteLines.push(parseInline(lines[i].replace(/^\s*> ?/, "")));
        i++;
      }
      out.push("<blockquote class=\"border-l-4 border-[var(--card-border)] pl-4 my-2 text-[var(--text-muted)]\">" + quoteLines.join("<br/>") + "</blockquote>");
      continue;
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*+] (.+)$/);
    if (ulMatch) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i].trimStart())) {
        items.push("<li>" + parseInline(lines[i].replace(/^[-*+] /, "").trim()) + "</li>");
        i++;
      }
      out.push("<ul class=\"list-disc pl-6 my-2\">" + items.join("") + "</ul>");
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^\d+\. (.+)$/);
    if (olMatch) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trimStart())) {
        items.push("<li>" + parseInline(lines[i].replace(/^\d+\. /, "").trim()) + "</li>");
        i++;
      }
      out.push("<ol class=\"list-decimal pl-6 my-2\">" + items.join("") + "</ol>");
      continue;
    }

    // Empty line -> paragraph break
    if (trimmed === "") {
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-block lines
    const pLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trimEnd();
      if (t === "" || t.startsWith("```") || t.startsWith("#") || t.startsWith(">") || /^[-*+] /.test(t) || /^\d+\. /.test(t)) break;
      pLines.push(parseInline(t));
      i++;
    }
    if (pLines.length) {
      out.push("<p class=\"my-2\">" + pLines.join("<br/>") + "</p>");
    }
  }

  return out.join("\n") || "";
}

