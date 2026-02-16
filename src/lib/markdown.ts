/**
 * Client-side markdown to HTML parser. Escapes HTML for safety, then applies
 * markdown rules. Use for rendering user/static content.
 */

const LINK_CLASS = "text-[var(--link-color)] hover:underline";
export const markdownProseClass =
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_p]:my-2 [&_pre]:bg-[var(--tag-bg)] [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:bg-[var(--tag-bg)] [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--card-border)] [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:text-[var(--text-muted)] [&_a]:text-[var(--link-color)] [&_a]:hover:underline [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-[var(--text-muted)] [&_figcaption]:mt-1";

/** Base URL for resolving relative image paths from the original Jekyll blog */
const JEKYLL_BASE = "https://mayank0255.github.io";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolve a src attribute: keep absolute URLs, prefix relative paths with Jekyll base */
function resolveImageSrc(src: string): string {
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `${JEKYLL_BASE}/${src}`;
}

/** Check if a URL is safe for use in src/href */
function isSafeUrl(url: string): boolean {
  return url.startsWith("/") || url.startsWith("#") || url.startsWith("mailto:") || /^https?:\/\//i.test(url);
}

/**
 * Extract and sanitize inline HTML tags from raw text BEFORE HTML escaping.
 * Replaces them with placeholder tokens, returns the token map.
 */
function extractInlineHtml(raw: string): { cleaned: string; tokens: Map<string, string> } {
  const tokens = new Map<string, string>();
  let idx = 0;

  // Strip HTML comments: <!-- ... -->
  let cleaned = raw.replace(/<!--[\s\S]*?-->/g, "");

  // Strip <div> and </div> tags (often wrapping images in Jekyll posts)
  cleaned = cleaned.replace(/<\/?div[^>]*>/gi, "");

  // Handle <video> tags
  cleaned = cleaned.replace(/<video\s+([^>]*)\/?\s*>(\s*<\/video>)?/gi, (_, attrs: string) => {
    const srcMatch = attrs.match(/src\s*=\s*"([^"]*)"/i) || attrs.match(/src\s*=\s*'([^']*)'/i);
    if (!srcMatch) return "";
    const token = `__HTML_TOKEN_${idx++}__`;
    tokens.set(token, ""); // Skip video elements that won't play
    return token;
  });

  // Handle <img ... > tags (self-closing or not)
  cleaned = cleaned.replace(/<img\s+([^>]*)\/?\s*>/gi, (_, attrs: string) => {
    const srcMatch = attrs.match(/src\s*=\s*"([^"]*)"/i) || attrs.match(/src\s*=\s*'([^']*)'/i);
    const altMatch = attrs.match(/alt\s*=\s*"([^"]*)"/i) || attrs.match(/alt\s*=\s*'([^']*)'/i);
    const widthMatch = attrs.match(/width\s*=\s*"([^"]*)"/i) || attrs.match(/width\s*=\s*'([^']*)'/i);
    const heightMatch = attrs.match(/height\s*=\s*"([^"]*)"/i) || attrs.match(/height\s*=\s*'([^']*)'/i);

    if (!srcMatch) return "";

    const resolvedSrc = resolveImageSrc(srcMatch[1]);
    if (!isSafeUrl(resolvedSrc)) return "";

    const alt = altMatch ? escapeHtml(altMatch[1]) : "";
    const style = widthMatch ? ` style="max-width:${escapeHtml(widthMatch[1])}"` : "";
    const height = heightMatch ? ` height="${escapeHtml(heightMatch[1])}"` : "";

    const token = `__HTML_TOKEN_${idx++}__`;
    tokens.set(
      token,
      `<img src="${escapeHtml(resolvedSrc)}" alt="${alt}"${style}${height} class="max-w-full h-auto rounded my-2" loading="lazy" />`
    );
    return token;
  });

  // Handle <figcaption> tags
  cleaned = cleaned.replace(/<figcaption([^>]*)>([\s\S]*?)<\/figcaption>/gi, (_, _attrs, content) => {
    const token = `__HTML_TOKEN_${idx++}__`;
    tokens.set(token, `<figcaption class="text-center text-sm text-[var(--text-muted)] mt-1">${escapeHtml(content.trim())}</figcaption>`);
    return token;
  });

  return { cleaned, tokens };
}

/** Restore tokens in the final HTML output */
function restoreTokens(html: string, tokens: Map<string, string>): string {
  let result = html;
  for (const [token, replacement] of tokens) {
    result = result.replaceAll(token, replacement);
  }
  return result;
}

/**
 * Process inline markdown: images, linked images, links, bold, italic, code.
 * Operates on RAW (unescaped) text, handles escaping internally.
 */
function parseInline(raw: string): string {
  // We process on raw text first to avoid double-escaping URLs.
  // Strategy: replace markdown patterns with tokens, then escape remaining text.

  const inlineTokens: [string, string][] = [];
  let tokenIdx = 0;
  const mkToken = () => `\x00IT${tokenIdx++}\x00`;

  let s = raw;

  // 1. Linked images: [![alt](imgsrc)](linkhref)
  s = s.replace(/\[!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]*)\)/g, (_, alt, imgSrc, linkHref) => {
    const resolvedSrc = resolveImageSrc(imgSrc);
    if (!isSafeUrl(resolvedSrc)) return escapeHtml(alt || "image");
    const safeHref = isSafeUrl(linkHref) ? linkHref : "#";
    const token = mkToken();
    inlineTokens.push([token, `<a href="${escapeHtml(safeHref)}" class="${LINK_CLASS}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(alt || "")}" class="inline max-w-full h-auto rounded" loading="lazy" /></a>`]);
    return token;
  });

  // 2. Standalone images: ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (_, alt, src) => {
    const resolvedSrc = resolveImageSrc(src);
    if (!isSafeUrl(resolvedSrc)) return escapeHtml(alt || "image");
    const token = mkToken();
    inlineTokens.push([token, `<img src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(alt || "")}" class="max-w-full h-auto rounded my-2" loading="lazy" />`]);
    return token;
  });

  // 3. Links: [label](href) — label may contain tokens from step 1/2
  s = s.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, label, href) => {
    const safeHref = isSafeUrl(href) ? href : "#";
    const token = mkToken();
    // label is NOT escaped yet; it may contain inline tokens which we restore later
    inlineTokens.push([token, `<a href="${escapeHtml(safeHref)}" class="${LINK_CLASS}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`]);
    return token;
  });

  // 4. Inline code: `code`
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    const token = mkToken();
    inlineTokens.push([token, `<code class="bg-[var(--tag-bg)] px-1 rounded text-sm">${escapeHtml(code)}</code>`]);
    return token;
  });

  // 5. Now escape the remaining text
  s = escapeHtml(s);

  // 6. Bold and italic (applied on escaped text, safe since they only use * characters)
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // 7. Restore inline tokens
  for (const [token, replacement] of inlineTokens) {
    s = s.replaceAll(token, replacement);
  }

  return s;
}

/** Convert markdown string to safe HTML. */
export function markdownToHtml(md: string): string {
  if (!md || typeof md !== "string") return "";

  // Step 1: Extract inline HTML (img, figcaption, comments) before any processing
  const { cleaned, tokens } = extractInlineHtml(md);

  const lines = cleaned.split("\n");
  const out: string[] = [];
  let i = 0;

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

    // Horizontal rule
    if (/^---+\s*$/.test(trimmed)) {
      out.push('<hr class="my-4 border-[var(--card-border)]" />');
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ") || trimmed === ">") {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].trimStart().startsWith(">") || lines[i].trimStart() === ">")) {
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

    // Empty line
    if (trimmed === "") {
      i++;
      continue;
    }

    // Line that is ONLY an HTML token → output directly (not wrapped in <p>)
    if (/^__HTML_TOKEN_\d+__$/.test(trimmed)) {
      out.push(trimmed);
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-block lines
    const pLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trimEnd();
      if (t === "" || t.startsWith("```") || t.startsWith("#") || (t.startsWith(">") && (t.startsWith("> ") || t === ">")) || /^[-*+] /.test(t) || /^\d+\. /.test(t) || /^---+\s*$/.test(t)) break;
      pLines.push(parseInline(t));
      i++;
    }
    if (pLines.length) {
      out.push("<p class=\"my-2\">" + pLines.join("<br/>") + "</p>");
    }
  }

  const html = out.join("\n") || "";

  // Step 2: Restore extracted HTML tokens
  return restoreTokens(html, tokens);
}
