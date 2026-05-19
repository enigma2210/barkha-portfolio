import { ARTS } from './articles';
import { PERSON } from './siteData';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { getUserArticles } from '../pages/admin/ArticleEditor';

const ARTICLE_STORE_KEY = 'barkha_articles_v1';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;
}

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

function normalizeArticle(article) {
  const slug = slugify(article.slug || article.title);
  const body = sanitizeHtml(article.body || '');
  const tags = Array.isArray(article.tags)
    ? article.tags
    : String(article.tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

  return {
    id: article.id || slug,
    slug,
    title: article.title || 'Untitled Article',
    subtitle: article.subtitle || '',
    cat: article.category || article.cat || 'Policy',
    category: article.category || article.cat || 'Policy',
    date: article.publishDate || article.date || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    publishDate: article.publishDate || article.date || new Date().toISOString(),
    excerpt: article.excerpt || buildExcerpt(body, article.subtitle),
    body,
    tag: tags[0] || article.tag || '',
    tags,
    featuredImage: article.featuredImage || '',
    authorName: article.authorName || PERSON.nameEn,
    readingTime: article.readingTime || estimateReadingTime(body),
    status: article.status || 'draft',
    seo: {
      metaTitle: article.seo?.metaTitle || article.metaTitle || article.title || '',
      metaDescription: article.seo?.metaDescription || article.metaDescription || article.excerpt || '',
      openGraphImage: article.seo?.openGraphImage || article.openGraphImage || article.featuredImage || '',
      canonicalUrl: article.seo?.canonicalUrl || article.canonicalUrl || '',
    },
    createdAt: article.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeUserArticle(article) {
  const body = sanitizeHtml(article.body || '');
  const category = article.cat || article.category || 'Uncategorised';
  return {
    id: article.id || slugify(article.title),
    slug: article.id || slugify(article.title),
    title: article.title || 'Untitled Article',
    subtitle: '',
    cat: category,
    category,
    date: article.date || new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    publishDate: article.dateRaw || article.date || new Date(article.createdAt || Date.now()).toISOString(),
    excerpt: article.excerpt || buildExcerpt(body),
    body,
    tag: category,
    tags: article.tags || [category],
    featuredImage: article.coverImage || '',
    coverImage: article.coverImage || '',
    coverFit: article.coverFit || 'cover',
    authorName: PERSON.nameEn,
    readingTime: estimateReadingTime(body),
    status: article.status || 'draft',
    createdAt: article.createdAt || Date.now(),
    updatedAt: article.createdAt || Date.now(),
    isUserArticle: true,
  };
}

function getPublishedUserArticles() {
  return getUserArticles()
    .filter((article) => article.status === 'published')
    .map(normalizeUserArticle)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
}

export function getStoredArticles() {
  try {
    return JSON.parse(localStorage.getItem(ARTICLE_STORE_KEY) || '[]').map(normalizeArticle);
  } catch {
    return [];
  }
}

export function saveStoredArticles(articles) {
  localStorage.setItem(ARTICLE_STORE_KEY, JSON.stringify(articles.map(normalizeArticle)));
}

export function saveArticle(article, status = article.status || 'draft') {
  const nextArticle = normalizeArticle({ ...article, status });
  const existing = getStoredArticles();
  const withoutCurrent = existing.filter((item) => item.id !== nextArticle.id && item.slug !== nextArticle.slug);
  const next = [nextArticle, ...withoutCurrent];
  saveStoredArticles(next);
  return nextArticle;
}

export function deleteArticle(id) {
  const next = getStoredArticles().filter((article) => article.id !== id && article.slug !== id);
  saveStoredArticles(next);
  return next;
}

export function getEditableArticles() {
  return getStoredArticles();
}

export function getPublishedArticles() {
  return [
    ...getPublishedUserArticles(),
    ...getStoredArticles().filter((article) => article.status === 'published'),
  ].sort((a, b) => {
    const bTime = Number(b.createdAt || 0) || Date.parse(b.updatedAt || b.publishDate);
    const aTime = Number(a.createdAt || 0) || Date.parse(a.updatedAt || a.publishDate);
    return bTime - aTime;
  });
}

export function getAllArticlesMap({ includeDrafts = false } = {}) {
  const local = includeDrafts
    ? [...getUserArticles().map(normalizeUserArticle), ...getStoredArticles()]
    : getPublishedArticles();
  return local.reduce(
    (acc, article) => ({ ...acc, [article.slug]: article }),
    { ...ARTS },
  );
}

export function getPublicArticlesArray() {
  const merged = getAllArticlesMap();
  return Object.values(merged);
}

export function getArticleById(id) {
  const articles = getAllArticlesMap();
  return articles[id] || articles.dpdp;
}

export { ARTICLE_STORE_KEY };
