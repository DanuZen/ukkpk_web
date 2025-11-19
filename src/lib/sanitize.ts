import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  // First pass: sanitize with DOMPurify
  let cleaned = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']
  });

  // Second pass: remove empty paragraphs and unnecessary spans
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
  cleaned = cleaned.replace(/\s+/g, ' '); // normalize whitespace
  
  return cleaned;
};
