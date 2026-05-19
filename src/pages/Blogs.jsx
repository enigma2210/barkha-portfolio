import { useMemo, useState } from 'react';
import { ARTS } from '../data/articles';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';
import { SplitText } from '../components/ui/SplitText';
import { TiltCard } from '../components/ui/TiltCard';
import { getUserArticles } from './admin/ArticleEditor';

function normalizeUserArticle(article) {
  const category = article.cat || 'Uncategorised';
  return {
    ...article,
    slug: article.id,
    cat: category,
    tag: category,
    tags: article.tags || [category],
    date: article.date || 'No date',
    excerpt: article.excerpt || '',
    isUserArticle: true,
  };
}

function BlogCard({ article, index, onOpen }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <FadeIn delay={index * 0.06} className="blog-card-reveal">
      <TiltCard
        className="blog-card blog-card-tilt"
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="blog-card-stripe" />
        <div className="blog-card-body">
          <span className="blog-cat">{article.cat}</span>
          <h3 className="blog-title">{article.title}</h3>
          <p className="blog-excerpt">{article.excerpt}</p>
        </div>
        <div className="blog-footer">
          <span className="blog-date">{article.date}</span>
          <span className="blog-read-link read-link">Read →</span>
        </div>
      </TiltCard>
    </FadeIn>
  );
}

export function Blogs({ openArticle }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const articles = useMemo(() => {
    const userArticles = getUserArticles()
      .filter((article) => article.status === 'published')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .map(normalizeUserArticle);

    return [...userArticles, ...Object.values(ARTS)];
  }, []);
  const tags = useMemo(
    () => ['all', ...new Set(articles.flatMap((article) => [article.tag, ...(article.tags || [])]).filter(Boolean))],
    [articles],
  );
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTag = tag === 'all' || article.tag === tag || article.tags?.includes(tag);
      const matchesQuery = !q || [article.title, article.excerpt, article.cat, article.subtitle]
        .some((value) => String(value || '').toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [articles, query, tag]);

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">The Archive</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Writing & Perspectives" />
          </h1>
          <p className="subtext u-subtext-center">
            On internet governance, AI policy, digital rights, and public interest technology
          </p>
        </div>
      </div>
      <section className="section u-bg-page">
        <div className="container">
          <div className="blog-filter-bar" role="search">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles..."
              aria-label="Search articles"
            />
            <div className="blog-tag-filters" aria-label="Article tag filters">
              {tags.map((item) => (
                <button
                  type="button"
                  className={tag === item ? 'blog-tag-filter is-active' : 'blog-tag-filter'}
                  key={item}
                  onClick={() => setTag(item)}
                >
                  {item === 'all' ? 'All' : item}
                </button>
              ))}
            </div>
          </div>
          <div className="blogs-grid">
            {visible.map((article, index) => (
              <BlogCard
                article={article}
                index={index}
                key={article.id}
                onOpen={() => openArticle(article.slug || article.id)}
              />
            ))}
          </div>
          {!visible.length ? <p className="no-comments">No articles match that search.</p> : null}
        </div>
      </section>
    </>
  );
}
