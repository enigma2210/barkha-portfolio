import { motion } from 'framer-motion';
import { AmbientOrb } from '../components/ui/AmbientOrb';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SplitText } from '../components/ui/SplitText';
import { ORGS } from '../data/siteData';
import sochLogo from '../../Gallery/Gallery/Logos/SOCH.png';

const INITIATIVES = [
  ['Social Welfare', 'Community-first programs that respond to local needs with practical support and sustained outreach.'],
  ['Empowerment', 'Initiatives designed to strengthen confidence, participation, and access to opportunity for underserved groups.'],
  ['Community Development', 'Local development work that connects people, institutions, and volunteers around shared social goals.'],
  ['Awareness & Action', 'Campaigns and field activities that turn civic awareness into everyday community participation.'],
];

const FOCUS_AREAS = [
  'Social welfare',
  'Community empowerment',
  'Education and awareness',
  'Local development initiatives',
  'Volunteer-led outreach',
  'Inclusive participation',
];

export function SOCH() {
  return (
    <div className="org-page org-page-soch">
      <AmbientOrb tone="mint" />
      <section className="org-hero org-hero-soch">
        <div className="soch-hero-top org-hero-top">
          <div className="org-logo-frame org-logo-frame-soch">
            <img src={sochLogo} alt="SOCH logo" />
          </div>
          <div className="org-badge">Registered NGO in Uttarakhand</div>
          <h1 className="org-name org-name-soch">
            <SplitText text={ORGS.soch.short} />
          </h1>
          <div className="org-fullname org-fullname-soch">{ORGS.soch.name}</div>
        </div>
        <div className="gradient-bar" aria-hidden="true" />
        <div className="soch-hero-bottom org-hero-bottom">
          <p className="org-tagline">
            SOCH, Social Organization for Connecting Happiness, works from Uttarakhand to support social
            welfare, empowerment, and community development initiatives that help people participate more
            confidently in local civic and social life.
          </p>
          <div className="u-center-flex org-cta-row">
            <a className="btn btn-soch" href={ORGS.soch.url} target="_blank" rel="noreferrer">
              Visit Official Website
            </a>
          </div>
        </div>
      </section>

      <section className="section u-bg-white">
        <div className="container">
          <Eyebrow className="u-color-mint-600">About SOCH</Eyebrow>
          <h2 className="section-h2 heading-lg u-mb-12">
            Community welfare, <em className="u-italic-mint">built around people.</em>
          </h2>
          <p className="org-intro-text">
            The organization brings a grassroots lens to social development: identifying community needs,
            building awareness, and coordinating initiatives that promote dignity, inclusion, and local action.
            Its work is intentionally practical, focused on connecting people with support, knowledge, and
            opportunities for collective progress.
          </p>

          <div className="org-focus-list" aria-label="SOCH focus areas">
            {FOCUS_AREAS.map((area) => (
              <span className="tag" key={area}>{area}</span>
            ))}
          </div>

          <div className="org-features org-feature-grid-compact">
            {INITIATIVES.map(([title, desc], index) => (
              <motion.div
                className="org-feat org-feat-soch"
                key={title}
                initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <h3 className="org-feat-title org-feat-title-soch">{title}</h3>
                <p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
