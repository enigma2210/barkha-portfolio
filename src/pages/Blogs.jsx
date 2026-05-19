import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';
import { SplitText } from '../components/ui/SplitText';
import { TiltCard } from '../components/ui/TiltCard';
import { getArticlePath, getPublishedArticles, subscribeToArticleChanges } from '../services/articleService';
import { isSupabaseConfigured } from '../services/supabaseClient';

function BlogCard({ article, index }) {
  return (
    <FadeIn delay={index * 0.06} className="blog-card-reveal">
      <TiltCard className="blog-card blog-card-tilt">
        <Link className="blog-card-button" to={getArticlePath(article)}>
          <div className="blog-card-stripe" />
          <div className="blog-card-body">
            <span className="blog-cat">{article.cat}</span>
            <h3 className="blog-title">{article.title}</h3>
            <p className="blog-excerpt">{article.excerpt}</p>
          </div>
          <div className="blog-footer">
            <span className="blog-date">{article.date}</span>
            <span className="blog-read-link read-link">Read {'\u2192'}</span>
          </div>
        </Link>
      </TiltCard>
    </FadeIn>
  );
}

export function Blogs() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      setLoading(true);
      try {
        const next = await getPublishedArticles();
        if (active) {
          setArticles(next);
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load articles.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadArticles();
    const unsubscribe = subscribeToArticleChanges(loadArticles);

    return () => {
      active = false;
      unsubscribe();
    };
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
      <SEO
        title="Articles"
        description="Articles and perspectives by Barkha Manral on Internet governance, AI policy, digital rights, cybersecurity, and public-interest technology."
        path="/articles"
      />

      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">The Archive</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Articles & Perspectives" />
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
              <BlogCard article={article} index={index} key={article.slug || article.id} />
            ))}
          </div>

          {!isSupabaseConfigured ? <p className="no-comments">Article database is not configured yet.</p> : null}
          {loading ? <p className="no-comments">Loading articles...</p> : null}
          {error ? <p className="no-comments">{error}</p> : null}
          {!loading && !error && !visible.length ? <p className="no-comments">No articles match that search.</p> : null}
        </div>
      </section>
    </>
  );
}
