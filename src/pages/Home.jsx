import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import { getArticlePath, getPublishedArticles } from '../data/articleStore';
import { AFFILIATIONS } from '../data/affiliations';
import { HERO_BIO, PERSON, STATS as SITE_STATS } from '../data/siteData';
import { CounterNumber } from '../components/ui/CounterNumber';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';

const CONTACT_LINKS = [
  { label: 'LinkedIn', href: PERSON.linkedin },
  { label: 'Mail', href: `mailto:${PERSON.email}` },
  { label: 'X', href: PERSON.twitter },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.2, 0.8, 0.2, 1] },
  },
};

function HeroSection() {
  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const inView = useInView(leftRef, { once: true });
  const { scrollYProgress } = useScroll({ target: heroRef });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section className="hero-section hero hero-cinematic home-live-hero" ref={heroRef}>
      <motion.div
        className="hero-blob hero-blob-1"
        animate={{ x: [0, 28], y: [0, -22], scale: [1, 1.08] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-blob hero-blob-2"
        animate={{ x: [0, 28], y: [0, -22], scale: [1, 1.08] }}
        transition={{ duration: 14, delay: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <div className="hero-dot-grid" aria-hidden="true" />

      <motion.div
        className="hero-left hero-cinematic-left"
        ref={leftRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div className="hero-eyebrow hero-badge" variants={itemVariants}>
          <span className="hero-eyebrow-dot badge-dot" />
          {PERSON.tagline}
        </motion.div>

        <motion.h1
          className="hero-name hero-cinematic-name home-live-title"
          variants={itemVariants}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(2.1rem, 4.8vw, 4.6rem)',
          }}
        >
          <span style={{ color: 'var(--text-ink)' }}>Barkha </span>
          <span
            style={{
              fontStyle: 'italic',
              background: 'var(--grad-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Manral
          </span>
        </motion.h1>

        <motion.p
          className="hero-deva"
          variants={itemVariants}
          style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
            marginTop: '0.4rem',
          }}
        >
          {PERSON.nameHi}
        </motion.p>

        <motion.blockquote className="hero-quote" variants={itemVariants}>
          "{PERSON.quote}"
        </motion.blockquote>

        <motion.p className="hero-bio" variants={itemVariants}>
          {HERO_BIO}
        </motion.p>

        <motion.div className="hero-signoff" variants={itemVariants}>
          <strong className="hero-signoff-strong">Cheers,</strong><br />
          <em>Barkha</em><br />
          <span className="hero-signoff-meta">
            {PERSON.signoff}
          </span>
        </motion.div>
      </motion.div>

      <div className="hero-photo-pane hero-cinematic-photo-pane">
        <div className="hero-bg-overlay" />
        <motion.img
          className="hero-main-image"
          src="/Gallery/Gallery/hero-section.png"
          alt={`${PERSON.nameEn} at an Internet governance forum`}
          style={{ y: imageY }}
        />
        <div className="hero-image-fade" />
      </div>
    </section>
  );
}

function SomeExcerpts() {
  const articles = useMemo(() => {
    return getPublishedArticles().slice(0, 6).map((article) => ({
      ...article,
      comments: article.readingTime ? `${article.readingTime} min read` : 'New Article',
    }));
  }, []);

  return (
    <section className="section home-live-excerpts">
      <div className="container">
        <FadeIn>
          <Eyebrow className="u-justify-center">Latest Articles</Eyebrow>
          <h2 className="section-h2 heading-lg home-live-section-title">Featured Articles</h2>
        </FadeIn>
        <div className="blogs-grid home-live-excerpt-grid">
          {articles.map((article, index) => (
              <FadeIn className="blog-card home-live-excerpt-card" delay={index * 0.08} key={article.id}>
                <Link className="blog-card-button" to={getArticlePath(article)}>
                  <div className="blog-card-stripe" />
                  <div className="blog-card-body">
                    <span className="blog-cat">{article.cat}</span>
                    <h3 className="blog-title">{article.title}</h3>
                    <p className="blog-excerpt">{article.excerpt}</p>
                  </div>
                  <div className="blog-footer">
                    <span className="blog-date">{article.date}</span>
                    <span className="blog-read-link">Read More</span>
                  </div>
                </Link>
              </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutMeSection() {
  return (
    <section className="about-section home-about-section">
      <div className="container">
        <div className="grid-2 home-about-grid">
          <FadeIn className="about-img-wrap">
            <div className="about-img-frame">
              <img src="/Gallery/Gallery/middle-section.png" alt={`${PERSON.nameEn} presenting`} />
            </div>
            <div className="about-stat-row">
              {SITE_STATS.map((stat) => (
                <div className="stat-box" key={stat.label}>
                  <div className="stat-number stat-n">
                    <CounterNumber value={`${stat.n}${stat.suffix}`} />
                  </div>
                  <div className="stat-label stat-l">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="about-body" direction="right" delay={0.08}>
            <Eyebrow>About Me</Eyebrow>
            <h2 className="section-h2 heading-lg u-mb-12">
              Bridging Technology, <em>Policy &amp; Community</em>
            </h2>
            <p>
              I connect the language of technology with the lived realities of public
              policy. My work spans internet governance, data protection, DNS security, AI policy,
              and youth capacity building.
            </p>
            <p>
              Through <strong>SOCH</strong>, I contribute to community resilience and local outreach.
              I founded <strong>IIRO</strong> to create pathways for digital literacy and meaningful
              participation in governance spaces that often feel inaccessible.
            </p>
            <div className="tag-row">
              {['Internet Governance', 'AI Governance', 'DNS Security', 'Digital Rights', 'Rural Outreach', 'Policy Research'].map((tag) => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="btn btn-primary" to="/about">
              Read More
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function AffiliationsSection() {
  return (
    <section className="affil-section home-affil-band">
      <div className="container">
        <div className="affil-header">
          <div className="affil-eyebrow">Global Engagements</div>
          <h2 className="section-h2 on-dark affil-heading">Policy, Research &amp; Community Roles.</h2>
          <div className="affil-divider" aria-hidden="true" />
        </div>
        <div className="affil-grid affil-cards">
          {AFFILIATIONS.map((item, index) => (
            <motion.article
              className="affil-card"
              key={item.id}
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="affil-logo" style={{ background: item.color }}>
                {item.logoSrc ? (
                  <img className="affil-logo-img" src={item.logoSrc} alt={`${item.logo} logo`} loading="lazy" />
                ) : item.logo}
              </div>
              <h3 className="affil-name">{item.name}</h3>
              <p className="affil-desc">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReachOut() {
  return (
    <section className="home-live-reach">
      <div className="container">
        <FadeIn>
          <Eyebrow className="u-justify-center">Feel free to reach out</Eyebrow>
          <div className="home-live-socials">
            {CONTACT_LINKS.map((link) => (
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <SEO
        title="Barkha Manral"
        description="Barkha Manral works across Internet governance, cybersecurity, AI policy, digital rights, and community-centered public-interest technology."
        path="/"
      />
      <HeroSection />
      <AboutMeSection />
      <AffiliationsSection />
      <SomeExcerpts />
      <ReachOut />
    </>
  );
}
