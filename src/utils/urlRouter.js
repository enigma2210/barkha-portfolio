// src/utils/urlRouter.js
// Lightweight History API wrapper, no routing library needed.

/**
 * Convert an article title to a URL slug.
 * Example: "India's DPDP Act - A Ticking Clock" becomes
 * "indias-dpdp-act-a-ticking-clock".
 */
export function toSlug(title = '') {
  return title
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

/**
 * Push a new article URL to browser history without reloading.
 */
export function pushArticleUrl(articleId, title) {
  const slug = toSlug(title || articleId);
  const url = `/articles/${slug}`;

  try {
    window.history.pushState({ articleId, slug }, title || '', url);
  } catch {
    // Ignore environments where pushState is restricted.
  }

  if (title) document.title = `${title} - Barkha Manral`;
}

/**
 * Push the base URL when navigating away from an article.
 */
export function pushBaseUrl(pageTitle = 'Barkha Manral') {
  try {
    window.history.pushState({}, pageTitle, '/');
  } catch {
    // Ignore environments where pushState is restricted.
  }

  document.title = pageTitle;
}

/**
 * Read the current URL on page load and determine if it points to an article.
 */
export function readInitialUrl() {
  const path = window.location.pathname;
  const match = path.match(/^\/(?:blog|articles)\/(.+)$/);

  if (match) {
    return { isArticle: true, slug: match[1] };
  }

  return { isArticle: false, slug: null };
}

/**
 * Given a slug, find the matching article from static and user articles.
 */
export function findArticleBySlug(slug, arts, userArticles = []) {
  for (const [key, art] of Object.entries(arts)) {
    if (toSlug(art.title) === slug || key === slug) return { ...art, id: key };
  }

  for (const art of userArticles) {
    if (toSlug(art.title) === slug || art.id === slug) return art;
  }

  return null;
}
