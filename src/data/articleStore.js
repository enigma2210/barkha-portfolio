import { ARTS } from './articles';
import { PERSON } from './siteData';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { getUserArticles } from '../pages/admin/ArticleEditor';
import { toSlug } from '../utils/urlRouter';

const ARTICLE_STORE_KEY = 'barkha_articles_v1';

function slugify(value) {
  return toSlug(value) || `article-${Date.now()}`;
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
  const slug = slugify(article.slug || article.title || article.id);
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
    coverImage: article.coverImage || article.featuredImage || '',
    coverFit: article.coverFit || 'cover',
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

function normalizeStaticArticle(key, article) {
  const body = sanitizeHtml(article.body || '');
  const category = article.category || article.cat || 'Policy';
  const tags = Array.isArray(article.tags) ? article.tags : [category].filter(Boolean);
  const slug = slugify(article.slug || article.title || key);

  return {
    ...article,
    id: key,
    slug,
    cat: category,
    category,
    tags,
    tag: article.tag || tags[0] || category,
    body,
    excerpt: article.excerpt || buildExcerpt(body, article.subtitle),
    featuredImage: article.featuredImage || article.coverImage || '',
    coverImage: article.coverImage || article.featuredImage || '',
    coverFit: article.coverFit || 'cover',
    authorName: article.authorName || PERSON.nameEn,
    readingTime: article.readingTime || estimateReadingTime(body),
    status: 'published',
    seo: {
      metaTitle: article.seo?.metaTitle || article.metaTitle || article.title || '',
      metaDescription: article.seo?.metaDescription || article.metaDescription || article.excerpt || '',
      openGraphImage: article.seo?.openGraphImage || article.openGraphImage || article.featuredImage || article.coverImage || '',
      canonicalUrl: article.seo?.canonicalUrl || article.canonicalUrl || '',
    },
  };
}

function normalizeUserArticle(article) {
  const body = sanitizeHtml(article.body || '');
  const category = article.cat || article.category || 'Uncategorised';
  const slug = slugify(article.slug || article.title || article.id);

  return {
    id: article.id || slug,
    slug,
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
    featuredImage: article.coverImage || article.featuredImage || '',
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

export function getStaticArticles() {
  return Object.entries(ARTS).map(([key, article]) => normalizeStaticArticle(key, article));
}

function getPublishedUserArticles() {
  return getUserArticles()
    .filter((article) => article.status === 'published')
    .map(normalizeUserArticle)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
}

function getArticleTimestamp(article) {
  const numericCreated = Number(article.createdAt || 0);
  if (numericCreated) return numericCreated;

  const parsed = Date.parse(article.publishDate || article.date || article.updatedAt || '');
  return Number.isNaN(parsed) ? 0 : parsed;
}

function uniqueArticles(articles) {
  const bySlug = new Map();

  articles.forEach((article) => {
    bySlug.set(article.slug || article.id, article);
  });

  return Array.from(bySlug.values());
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
  return uniqueArticles([
    ...getStaticArticles(),
    ...getStoredArticles().filter((article) => article.status === 'published'),
    ...getPublishedUserArticles(),
  ]).sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
}

export function getAllArticlesMap({ includeDrafts = false } = {}) {
  const local = includeDrafts
    ? [
      ...getStaticArticles(),
      ...getStoredArticles(),
      ...getUserArticles().map(normalizeUserArticle),
    ]
    : getPublishedArticles();

  return local.reduce((acc, article) => {
    acc[article.id] = article;
    acc[article.slug] = article;
    return acc;
  }, {});
}

export function getPublicArticlesArray() {
  return getPublishedArticles();
}

export function getArticleById(id) {
  const articles = getAllArticlesMap();
  return articles[id] || null;
}

export function getArticleBySlug(slug) {
  const raw = String(slug || '');
  let decoded = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  const cleanSlug = toSlug(decoded);
  const articles = getAllArticlesMap();
  return articles[raw] || articles[decoded] || articles[cleanSlug] || null;
}

export function getArticlePath(articleOrSlug) {
  const slug = typeof articleOrSlug === 'string'
    ? toSlug(articleOrSlug)
    : articleOrSlug?.slug || toSlug(articleOrSlug?.title || articleOrSlug?.id);

  return `/articles/${slug}`;
}

export function getRelatedArticles(article, limit = 3) {
  if (!article) return [];

  const currentTags = new Set([article.cat, article.category, article.tag, ...(article.tags || [])].filter(Boolean));

  return getPublishedArticles()
    .filter((item) => item.slug !== article.slug && item.id !== article.id)
    .map((item) => {
      const itemTags = [item.cat, item.category, item.tag, ...(item.tags || [])].filter(Boolean);
      const score = itemTags.reduce((total, tag) => total + (currentTags.has(tag) ? 1 : 0), 0);
      return { ...item, relatedScore: score };
    })
    .sort((a, b) => b.relatedScore - a.relatedScore || getArticleTimestamp(b) - getArticleTimestamp(a))
    .slice(0, limit);
}

export { ARTICLE_STORE_KEY };
