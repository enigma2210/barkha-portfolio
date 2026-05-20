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
  'IFRAME',
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
  'S',
  'STRIKE',
  'U',
  'UL',
]);

const GLOBAL_ATTRS = new Set(['class', 'style', 'title', 'aria-label', 'data-image-id']);
const TAG_ATTRS = {
  A: new Set(['href', 'target', 'rel']),
  IMG: new Set(['src', 'alt', 'width', 'height']),
  IFRAME: new Set(['src', 'title', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy', 'width', 'height']),
};

function isSafeUrl(value) {
  return /^(https?:|mailto:|tel:|data:image\/)/i.test(value || '')
    || String(value || '').startsWith('/')
    || String(value || '').startsWith('#');
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value || '') && typeof window !== 'undefined'
    ? new URL(value, window.location.origin).origin !== window.location.origin
    : /^https?:\/\//i.test(value || '');
}

function isSafeEmbedUrl(value) {
  try {
    const url = new URL(value || '');
    return [
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'player.vimeo.com',
      'vimeo.com',
    ].includes(url.hostname);
  } catch {
    return false;
  }
}

function hardenDocument(doc) {
  doc.body.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';

    if (!isSafeUrl(href)) {
      link.removeAttribute('href');
      return;
    }

    if (isExternalUrl(href)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    } else {
      link.removeAttribute('target');
      link.setAttribute('rel', 'noopener');
    }
  });

  doc.body.querySelectorAll('iframe[src]').forEach((frame) => {
    const src = frame.getAttribute('src') || '';
    if (!isSafeEmbedUrl(src)) {
      frame.remove();
      return;
    }

    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute('allowfullscreen', '');
  });
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

    if (node.tagName === 'IFRAME' && !isSafeEmbedUrl(node.getAttribute('src'))) node.remove();
  });

  hardenDocument(doc);
  return doc.body.innerHTML;
}

export function sanitizeHtml(html) {
  if (DOMPurify?.sanitize) {
    const cleaned = DOMPurify.sanitize(html, {
      ADD_ATTR: [
        'target',
        'data-image-id',
        'allow',
        'allowfullscreen',
        'loading',
        'referrerpolicy',
      ],
      ADD_TAGS: ['figure', 'figcaption', 'iframe'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#|data:image\/)/i,
    });

    if (typeof window === 'undefined' || !window.DOMParser) return cleaned;

    const doc = new window.DOMParser().parseFromString(cleaned, 'text/html');
    hardenDocument(doc);
    return doc.body.innerHTML;
  }

  return fallbackSanitize(html);
}
