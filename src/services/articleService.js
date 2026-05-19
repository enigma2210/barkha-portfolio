import { PERSON } from '../data/siteData';
import { estimateReadingTime, buildExcerpt } from '../data/articleStore';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { toSlug } from '../utils/urlRouter';
import { isSupabaseConfigured, requireSupabase, supabase } from './supabaseClient';

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDate(value) {
  const timestamp = Date.parse(value || '');
  if (Number.isNaN(timestamp)) return value || 'No date';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getArticlePath(articleOrSlug) {
  const slug = typeof articleOrSlug === 'string'
    ? toSlug(articleOrSlug)
    : articleOrSlug?.slug || toSlug(articleOrSlug?.title || articleOrSlug?.id);

  return `/articles/${slug}`;
}

export function normalizeArticle(row) {
  if (!row) return null;

  const body = sanitizeHtml(row.content || row.body || '');
  const category = row.category || row.cat || 'Uncategorised';
  const tags = Array.isArray(row.tags) ? row.tags : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title || 'Untitled Article',
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || buildExcerpt(body),
    body,
    content: body,
    coverImage: row.cover_image || row.coverImage || '',
    featuredImage: row.cover_image || row.featuredImage || '',
    coverFit: row.coverFit || 'cover',
    authorName: row.author || row.authorName || PERSON.nameEn,
    author: row.author || row.authorName || PERSON.nameEn,
    cat: category,
    category,
    tag: tags[0] || category,
    tags,
    published: Boolean(row.published),
    status: row.published ? 'published' : 'draft',
    publishedAt: row.published_at || row.publishedAt || '',
    publishDate: row.published_at || row.publishDate || row.created_at,
    date: formatDate(row.published_at || row.created_at),
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
    readingTime: estimateReadingTime(body),
    seo: {
      metaTitle: row.seo_title || row.seo?.metaTitle || row.title || '',
      metaDescription: row.seo_description || row.seo?.metaDescription || row.excerpt || stripHtml(body).slice(0, 160),
      openGraphImage: row.cover_image || row.seo?.openGraphImage || '',
      canonicalUrl: row.seo?.canonicalUrl || '',
    },
  };
}

function toDbArticle(article, status = article.status) {
  const body = sanitizeHtml(article.body || article.content || '');
  const published = status === 'published' || article.published === true;
  const slug = toSlug(article.slug || article.title);
  const now = new Date().toISOString();

  return {
    title: article.title?.trim() || 'Untitled Article',
    slug,
    excerpt: article.excerpt || buildExcerpt(body, article.subtitle),
    content: body,
    cover_image: article.coverImage || article.featuredImage || article.cover_image || null,
    author: article.authorName || article.author || PERSON.nameEn,
    category: article.category || article.cat || 'Uncategorised',
    tags: Array.isArray(article.tags)
      ? article.tags
      : String(article.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    published,
    published_at: published ? (article.publishedAt || article.published_at || now) : null,
    seo_title: article.seo?.metaTitle || article.seoTitle || article.title || '',
    seo_description: article.seo?.metaDescription || article.seoDescription || article.excerpt || buildExcerpt(body),
  };
}

async function ensureUniqueSlug(base, currentId) {
  const client = requireSupabase();
  const cleanBase = toSlug(base) || `article-${Date.now()}`;
  let candidate = cleanBase;
  let suffix = 2;

  while (true) {
    const query = client
      .from('articles')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.id === currentId) return candidate;

    candidate = `${cleanBase}-${suffix}`;
    suffix += 1;
  }
}

export async function getPublishedArticles({ limit } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalizeArticle);
}

export async function getArticleBySlug(slug) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', toSlug(slug))
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return normalizeArticle(data);
}

export async function getEditableArticles() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeArticle);
}

export async function saveArticle(article, status = article.status || 'draft') {
  const client = requireSupabase();
  const dbArticle = toDbArticle(article, status);
  dbArticle.slug = await ensureUniqueSlug(dbArticle.slug || dbArticle.title, article.id);

  const query = article.id
    ? client.from('articles').update(dbArticle).eq('id', article.id).select('*').single()
    : client.from('articles').insert(dbArticle).select('*').single();

  const { data, error } = await query;
  if (error) throw error;
  return normalizeArticle(data);
}

export async function deleteArticle(id) {
  const client = requireSupabase();
  const { error } = await client.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export async function getRelatedArticles(article, limit = 3) {
  if (!article || !isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .neq('id', article.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(12);

  if (error) throw error;

  const currentTags = new Set([article.category, article.cat, ...(article.tags || [])].filter(Boolean));
  return (data || [])
    .map(normalizeArticle)
    .map((item) => ({
      ...item,
      relatedScore: [item.category, item.cat, ...(item.tags || [])]
        .filter(Boolean)
        .reduce((score, tag) => score + (currentTags.has(tag) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.relatedScore - a.relatedScore || Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt))
    .slice(0, limit);
}

export function subscribeToArticleChanges(onChange) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('public-articles-feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
