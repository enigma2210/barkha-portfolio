import { Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';
import { SplitText } from '../components/ui/SplitText';
import { getArticlePath, getPublishedArticles } from '../data/articleStore';

export function Publications() {
  const articles = getPublishedArticles();

  return (
    <>
      <SEO
        title="Publications"
        description="Published research notes, explainers, articles, and policy commentary by Barkha Manral."
        path="/publications"
      />

      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">Publications</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Research & Writing" />
          </h1>
          <p className="subtext u-subtext-center">
            A curated view of published analysis on digital policy, cybersecurity, Internet governance, and public-interest technology.
          </p>
        </div>
      </div>

      <section className="section u-bg-page">
        <div className="container">
          <div className="blogs-grid">
            {articles.map((article, index) => (
              <FadeIn className="blog-card" delay={index * 0.05} key={article.slug || article.id}>
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
