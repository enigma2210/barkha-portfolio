import { useState } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SplitText } from '../components/ui/SplitText';
import {
  EXPERIENCE_CARDS,
  POLICY_RESEARCH,
  PORTFOLIO_BIO,
  SPEAKING_ENGAGEMENTS,
} from '../data/portfolio';
import { PERSON, PORTFOLIO_CLOSING } from '../data/siteData';

const TABS = [
  { id: 'policy', label: 'Policy & Research', items: POLICY_RESEARCH },
  { id: 'speaking', label: 'Speaking Engagements', items: SPEAKING_ENGAGEMENTS },
];

const closingBlockStyle = {
  textAlign: 'center',
  padding: 'clamp(3rem,5vw,5rem) 2rem',
  background: 'var(--bg-white)',
  borderTop: '1px solid var(--border)',
};

const closingQuoteStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontSize: '1.15rem',
  color: 'var(--sky-800)',
  maxWidth: '680px',
  margin: '0 auto 1.5rem',
  lineHeight: 1.7,
};

const closingLinkRowStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '1.5rem',
  flexWrap: 'wrap',
};

const closingLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(20,184,166,0.08)',
  color: 'var(--teal-600)',
  border: '1px solid rgba(20,184,166,0.18)',
  borderRadius: 'var(--r-full)',
  padding: '0.5rem 1.2rem',
  fontSize: '0.82rem',
  fontWeight: 700,
};

function Timeline({ items, activeTab }) {
  return (
    <div className="timeline portfolio-tab-timeline">
      <motion.div
        className="timeline-line"
        key={`${activeTab}-line`}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        style={{ transformOrigin: 'top' }}
      />
      {items.map((item, index) => (
        <motion.div
          className="tl-item"
          key={item.id}
          initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: index * 0.07 }}
        >
          <div className="tl-dot" />
          <div className="tl-year">{item.year}</div>
          <div className="tl-role">{item.title}</div>
          <div className="tl-desc">{item.desc}</div>
          <span className="tl-badge">{item.tag}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function Portfolio() {
  const [activeTab, setActiveTab] = useState('policy');
  const activeItems = TABS.find((tab) => tab.id === activeTab)?.items ?? POLICY_RESEARCH;

  return (
    <>
      <SEO
        title="Portfolio"
        description="Barkha Manral's portfolio across Internet governance fellowships, policy research, technical writing, speaking, and community work."
        path="/portfolio"
      />
      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">Professional Record</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="My Portfolio" />
          </h1>
          <p className="subtext u-subtext-center">
            I am an Internet governance advocate, tech policy enthusiast, and founder of the India
            Internet Research Organisation (IIRO).
          </p>
        </div>
      </div>

      <section className="section portfolio-page">
        <div className="container">
          <section className="portfolio-section portfolio-bio-section">
            <motion.div
              className="bio-card portfolio-bio-card"
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow>Bio</Eyebrow>
              <p>{PORTFOLIO_BIO}</p>
            </motion.div>
          </section>

          <section className="portfolio-section portfolio-timeline-section">
            <div className="portfolio-section-head">
              <Eyebrow>Policy & Research</Eyebrow>
              <h2 className="section-h2 heading-lg u-mb-20">
                Fellowship &amp; <em>Engagements</em>
              </h2>
            </div>

            <div className="portfolio-tabs" role="tablist" aria-label="Portfolio timeline sections">
              {TABS.map((tab) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={activeTab === tab.id ? 'portfolio-tab is-active' : 'portfolio-tab'}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Timeline items={activeItems} activeTab={activeTab} />
          </section>

          <section className="portfolio-section portfolio-experience-section">
            <div className="portfolio-section-head">
              <Eyebrow>Experience</Eyebrow>
              <h2 className="section-h2 heading-lg u-mb-20">
                Technical Writing &amp; <em>Community Work</em>
              </h2>
            </div>

            <div className="exp-cards portfolio-experience-grid">
              {EXPERIENCE_CARDS.map((item, index) => (
                <motion.div
                  className="exp-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.62, delay: index * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div className="exp-icon" aria-hidden="true">{item.icon}</div>
                  <div className={`exp-cat exp-cat-${item.tagColor}`}>{item.tag}</div>
                  <div className="exp-title">{item.title}</div>
                  <div className="exp-desc">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <div style={closingBlockStyle}>
        <p style={closingQuoteStyle}>
          "{PORTFOLIO_CLOSING}"
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {'\u2014'} {PERSON.nameEn}
        </p>
        <div style={closingLinkRowStyle}>
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={closingLinkStyle}
          >
            LinkedIn
          </a>
          <a href={`mailto:${PERSON.email}`} style={closingLinkStyle}>
            Email
          </a>
          <a
            href={PERSON.github}
            target="_blank"
            rel="noopener noreferrer"
            style={closingLinkStyle}
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
