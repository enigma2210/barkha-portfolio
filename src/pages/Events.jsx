import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { FadeIn } from '../components/ui/FadeIn';
import { SplitText } from '../components/ui/SplitText';
import { POLICY_RESEARCH, SPEAKING_ENGAGEMENTS } from '../data/portfolio';

const EVENTS = [...POLICY_RESEARCH, ...SPEAKING_ENGAGEMENTS];

export function Events() {
  return (
    <>
      <SEO
        title="Events"
        description="Events, fellowships, speaking engagements, and Internet governance forums featuring Barkha Manral."
        path="/events"
      />

      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">Events</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Forums & Engagements" />
          </h1>
          <p className="subtext u-subtext-center">
            A route-based record of fellowships, speaking engagements, mentoring roles, and community forums.
          </p>
        </div>
      </div>

      <section className="section portfolio-page">
        <div className="container">
          <div className="timeline portfolio-tab-timeline">
            <div className="timeline-line" />
            {EVENTS.map((item, index) => (
              <FadeIn className="tl-item" delay={index * 0.04} key={`${item.id}-${index}`}>
                <div className="tl-dot" />
                <div className="tl-year">{item.year}</div>
                <div className="tl-role">{item.title}</div>
                <div className="tl-desc">{item.desc}</div>
                <span className="tl-badge">{item.tag}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
