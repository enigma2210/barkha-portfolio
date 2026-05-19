import { AmbientOrb } from '../components/ui/AmbientOrb';
import { CounterNumber } from '../components/ui/CounterNumber';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';
import { SplitText } from '../components/ui/SplitText';
import { ICANN85_EVENT, PERSON, STATS as SITE_STATS } from '../data/siteData';

export function About({ go }) {
  return (
    <div className="about-page">
      <AmbientOrb tone="sky" />
      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">About</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text={PERSON.nameEn} />
          </h1>
          <p className="subtext u-subtext-center">
            I am a writer, Internet Governance advocate, policy researcher, social entrepreneur, and founder
            working across public-interest technology and digital equity.
          </p>
        </div>
      </div>

      <section className="about-section">
        <div className="container">
          <div className="grid-2">
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
              <Eyebrow>Profile</Eyebrow>
              <h2 className="section-h2 heading-lg u-mb-12">
                Bringing technology, policy, and <span className="text-gradient">community</span> together.
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
              <p>
                Across ICANN, APSIG, YIGF, APIGA, and civil society networks, my focus remains clear:
                the internet should be shaped by the people it affects.
              </p>
              <p>
                Recent ICANN engagement includes {ICANN85_EVENT.name} in {ICANN85_EVENT.location},
                where I served as a mentor for ICANN Fellows.
              </p>
              <div className="tag-row">
                {['Internet Governance', 'AI Governance', 'DNS Security', 'Digital Rights', 'Rural Outreach', 'Policy Research'].map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              <button className="btn btn-primary" type="button" onClick={() => go('contact')}>
                Start a Conversation
              </button>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
