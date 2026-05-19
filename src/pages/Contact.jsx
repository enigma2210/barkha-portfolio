import { useState } from 'react';
import { saveContactMessage } from '../data/comments';
import { PERSON } from '../data/siteData';
import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SplitText } from '../components/ui/SplitText';

const CONTACT_LINKS = [
  { icon: '\u2709', label: 'Email', val: PERSON.email },
  { icon: '\u25CE', label: 'Website', val: PERSON.website },
  { icon: '\u25C7', label: 'ICANN Community', val: new URL(PERSON.icann).host },
  { icon: '@', label: 'Social', val: `@${new URL(PERSON.twitter).pathname.replace('/', '')}` },
];

export function Contact({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!consentGiven) {
      setConsentError(true);
      return;
    }

    setConsentError(false);
    saveContactMessage({ ...form, id: `m${Date.now()}`, date: new Date().toISOString() });
    setForm({ name: '', email: '', message: '' });
    setConsentGiven(false);
    showToast?.("Message sent - I'll be in touch shortly.");
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Contact Barkha Manral for collaborations in Internet governance, digital rights research, tech policy, mentoring, and community programs."
        path="/contact"
      />
      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">Let's Connect</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Contact" />
          </h1>
          <p className="subtext u-subtext-center">
            Open to collaborations in internet governance, tech policy, rural outreach, and digital
            rights research.
          </p>
        </div>
      </div>

      <section className="contact-section section">
        <div className="container">
          <div className="grid-2 u-ai-start">
            <div>
              <Eyebrow>Reach Out</Eyebrow>
              <h2 className="section-h2 heading-lg u-mb-08">
                Policy work grows through <span className="text-gradient">conversation</span>.
              </h2>
              <p className="subtext u-mb-18">
                For talks, research collaborations, mentoring, or community programs, send a note.
              </p>
              <div className="contact-links-col">
                {CONTACT_LINKS.map((link) => (
                  <div className="contact-link" key={link.label}>
                    <span className="cl-icon">{link.icon}</span>
                    <div>
                      <div className="cl-label">{link.label}</div>
                      <div className="cl-val">{link.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="contact-form-box" onSubmit={submit}>
              <h3>Send a Message</h3>
              <div className="form-2col">
                <div className="form-field">
                  <label htmlFor="contact-name">Your Name</label>
                  <input id="contact-name" className="form-input" value={form.name} onChange={update('name')} required />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email Address</label>
                  <input id="contact-email" type="email" className="form-input" value={form.email} onChange={update('email')} required />
                </div>
              </div>
              <div className="form-field u-mb-12">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="form-input" value={form.message} onChange={update('message')} required />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: consentError ? 'rgba(239,68,68,0.04)' : 'rgba(20,184,166,0.04)',
                  border: `1px solid ${consentError ? 'rgba(239,68,68,0.25)' : 'rgba(20,184,166,0.18)'}`,
                  borderRadius: 'var(--r-md)',
                  marginTop: '0.5rem',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <div style={{ flexShrink: 0, marginTop: '1px' }}>
                  <input
                    type="checkbox"
                    id="contact-consent"
                    checked={consentGiven}
                    onChange={(event) => {
                      setConsentGiven(event.target.checked);
                      if (event.target.checked) setConsentError(false);
                    }}
                    style={{
                      width: 17,
                      height: 17,
                      cursor: 'pointer',
                      accentColor: 'var(--teal-500)',
                    }}
                  />
                </div>
                <label
                  htmlFor="contact-consent"
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.55,
                    color: consentError ? '#B91C1C' : 'var(--text-mid)',
                    cursor: 'pointer',
                  }}
                >
                  I consent to sharing my <strong>name</strong> and <strong>email address</strong> with{' '}
                  <strong>Barkha Manral</strong> for the purpose of responding to my message. I understand
                  that my information will be used solely for this communication and will not be shared with
                  third parties. <span style={{ color: '#B91C1C', fontWeight: 700 }}>*</span>
                </label>
              </div>
              {consentError ? (
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#B91C1C',
                    marginTop: '0.4rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>{'\u26A0'}</span> Please provide your consent before sending a message.
                </p>
              ) : null}
              <button
                className="btn u-full-width"
                type="submit"
                style={{
                  marginTop: '1rem',
                  background: consentGiven
                    ? 'linear-gradient(135deg, #1563B2, #14B8A6)'
                    : 'rgba(0,0,0,0.18)',
                  color: consentGiven ? 'white' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  padding: '0.72rem 2rem',
                  borderRadius: 'var(--r-full)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: consentGiven ? 'pointer' : 'not-allowed',
                  transition: 'background 0.25s, color 0.25s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                Send Message {'\u2192'}
              </button>
              <p
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--text-muted)',
                  marginTop: '1rem',
                  lineHeight: 1.55,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.9rem',
                }}
              >
                {'\uD83D\uDD12'} Your data is handled in accordance with India's{' '}
                <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>. Your name and
                email will only be used to respond to your message. You may withdraw consent at any time
                by contacting{' '}
                <a
                  href="mailto:info@barkhamanral.in"
                  style={{ color: 'var(--teal-600)', textDecoration: 'underline', textUnderlineOffset: 2 }}
                >
                  info@barkhamanral.in
                </a>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
