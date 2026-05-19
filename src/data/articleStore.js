import { toSlug } from '../utils/urlRouter';

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function estimateReadingTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function buildExcerpt(html, fallback = '') {
  const text = stripHtml(html || fallback);
  return text.length > 180 ? `${text.slice(0, 180).trim()}...` : text;
}

export function getArticlePath(articleOrSlug) {
  const slug = typeof articleOrSlug === 'string'
    ? toSlug(articleOrSlug)
    : articleOrSlug?.slug || toSlug(articleOrSlug?.title || articleOrSlug?.id);

  return `/articles/${slug}`;
}
