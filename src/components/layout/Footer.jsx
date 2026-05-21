import { Link } from 'react-router-dom';
import { ORGS, PERSON } from '../../data/siteData';

const FOOTER_NAV = [
  ['Home', '/'],
  ['Articles', '/articles'],
  ['Portfolio', '/portfolio'],
  ['Gallery', '/gallery'],
  ['About', '/about'],
  ['Admin', '/admin'],
];

const FOOTER_CONTACT = [
  ['Email', `mailto:${PERSON.email}`],
  ['Website', `https://${PERSON.website}`],
  [ORGS.iiro.short, ORGS.iiro.url],
  ['LinkedIn', PERSON.linkedin],
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-en">{PERSON.nameEn}</div>
          <div className="footer-brand-hi">{PERSON.nameHi}</div>
          <p className="footer-tagline">
            Internet governance, policy research, digital rights advocacy, and community building.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Navigation</h4>
          {FOOTER_NAV.map(([label, path]) => (
            <Link key={path} to={path}>
              {label}
            </Link>
          ))}
        </div>

        <div className="footer-links-col">
          <h4>Contact</h4>
          {FOOTER_CONTACT.map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 {PERSON.nameEn}. All rights reserved.</span>
        <span>{PERSON.tagline}</span>
      </div>
    </footer>
  );
}
