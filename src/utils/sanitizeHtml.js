import DOMPurify from 'dompurify';

const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DIV',
  'EM',
  'FIGCAPTION',
  'FIGURE',
  'H1',
  'H2',
  'H3',
  'H4',
  'HR',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'PRE',
  'SPAN',
  'STRONG',
  'U',
  'UL',
]);

const GLOBAL_ATTRS = new Set(['class', 'style', 'title', 'aria-label', 'data-image-id']);
const TAG_ATTRS = {
  A: new Set(['href', 'target', 'rel']),
  IMG: new Set(['src', 'alt', 'width', 'height']),
};

function isSafeUrl(value) {
  return /^(https?:|mailto:|tel:|data:image\/)/i.test(value || '') || String(value || '').startsWith('/');
}

function fallbackSanitize(html) {
  if (typeof window === 'undefined' || !window.DOMParser) return String(html || '');

  const doc = new window.DOMParser().parseFromString(String(html || ''), 'text/html');
  doc.body.querySelectorAll('*').forEach((node) => {
    if (!ALLOWED_TAGS.has(node.tagName)) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const allowedForTag = TAG_ATTRS[node.tagName]?.has(name);
      const allowed = GLOBAL_ATTRS.has(name) || allowedForTag;
      const unsafeHandler = name.startsWith('on');
      const unsafeUrl = ['href', 'src'].includes(name) && !isSafeUrl(attr.value);

      if (!allowed || unsafeHandler || unsafeUrl) {
        node.removeAttribute(attr.name);
      }
    });

    if (node.tagName === 'A') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return doc.body.innerHTML;
}

export function sanitizeHtml(html) {
  if (DOMPurify?.sanitize) {
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'data-image-id'],
      ADD_TAGS: ['figure', 'figcaption'],
    });
  }

  return fallbackSanitize(html);
}
