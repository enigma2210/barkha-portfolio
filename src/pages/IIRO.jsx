import { motion } from 'framer-motion';
import { AmbientOrb } from '../components/ui/AmbientOrb';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SplitText } from '../components/ui/SplitText';
import { ORGS } from '../data/siteData';
import iiroLogo from '../../Gallery/Gallery/Logos/IIRO.png';

const POLICY_AREAS = [
  ['Internet Governance', 'Research and analysis on how internet policy, institutions, and multistakeholder processes affect India.'],
  ['Cybersecurity', 'Policy-facing work on secure digital infrastructure, risk awareness, and safer online participation.'],
  ['Privacy & Digital Rights', 'Public-interest research around data protection, user rights, trust, and accountable technology.'],
  ['Emerging Technologies', 'Study of AI and other emerging technologies through a governance, inclusion, and rights lens.'],
  ['Digital Inclusion', 'Work focused on access, literacy, and participation for communities still underserved by digital systems.'],
  ['Public Policy Research', 'Clear explainers, policy notes, and community-oriented research for practitioners and citizens.'],
];

const THEMES = [
  'Internet governance',
  'Cybersecurity',
  'Privacy',
  'Digital rights',
  'Emerging technologies',
  'Digital inclusion',
];

export function IIRO() {
  return (
    <div className="org-page org-page-iiro">
      <AmbientOrb tone="mint" />
      <section className="org-hero org-hero-iiro">
        <div className="soch-hero-top iiro-hero-top org-hero-top">
          <div className="org-logo-frame org-logo-frame-iiro">
            <img src={iiroLogo} alt="IIRO logo" />
          </div>
          <div className="org-badge">Research and Policy Think Tank</div>
          <h1 className="org-name org-name-iiro">
            <SplitText text={ORGS.iiro.short} />
          </h1>
          <div className="org-fullname org-fullname-iiro">{ORGS.iiro.name}</div>
        </div>
        <div className="gradient-bar" aria-hidden="true" />
        <div className="soch-hero-bottom iiro-hero-bottom org-hero-bottom">
          <p className="org-tagline">
            IIRO, the India Internet Research Organisation, is a research and policy think tank focused on
            internet governance, cybersecurity, privacy, digital rights, emerging technologies, and digital
            inclusion in India.
          </p>
          <div className="u-center-flex org-cta-row">
            <a className="btn btn-iiro" href={ORGS.iiro.url} target="_blank" rel="noreferrer">
              Visit Official Website
            </a>
          </div>
        </div>
      </section>

      <section className="section u-bg-white">
        <div className="container">
          <Eyebrow>IIRO Focus</Eyebrow>
          <h2 className="section-h2 heading-lg u-mb-12">
            Public-interest research for <em className="text-gradient u-italic">India's digital future.</em>
          </h2>
          <p className="org-intro-text">
            The organization translates complex technology and policy developments into accessible research,
            analysis, and civic knowledge. Its work is designed for a broad public-interest ecosystem:
            researchers, communities, policymakers, and practitioners working toward a secure, inclusive, and
            rights-respecting internet.
          </p>

          <div className="org-focus-list" aria-label="IIRO policy areas">
            {THEMES.map((theme) => (
              <span className="tag" key={theme}>{theme}</span>
            ))}
          </div>

          <div className="org-features org-feature-grid-compact">
            {POLICY_AREAS.map(([title, desc], index) => (
              <motion.div
                className="org-feat org-feat-iiro"
                key={title}
                initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <h3 className="org-feat-title org-feat-title-iiro">{title}</h3>
                <p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
