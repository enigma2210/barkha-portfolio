import { ICANN_FELLOWSHIP_EVENTS, SPEAKING } from './siteData';

export { PORTFOLIO_BIO } from './siteData';

const fellowshipMeetingNames = ICANN_FELLOWSHIP_EVENTS.map((event) => event.name).join(', ');

export const POLICY_RESEARCH = [
  {
    id: 'icann85',
    year: '2026',
    title: 'ICANN 85 Community Forum — Mumbai, India',
    desc: 'Represented the mentor community at the ICANN 85 Community Forum held in Mumbai, India (March 2026). Served as a mentor for ICANN Fellows, supporting the next generation of Internet governance advocates through the ICANN fellowship programme.',
    tag: 'Mentor',
  },
  {
    id: 'icann-fellow',
    year: '2023–2024',
    title: `ICANN Fellow (${fellowshipMeetingNames})`,
    desc: 'Contributed to DNS security policies across three ICANN meetings as a NextGen@ICANN Fellow.',
    tag: 'Fellowship',
  },
  {
    id: 'yigf',
    year: '2024',
    title: 'YIGF Organizer & APIGA India Coordinator',
    desc: 'Led capacity-building workshops for youth entering internet governance spaces across India.',
    tag: 'Leadership',
  },
  {
    id: 'netmission',
    year: '2023–2024',
    title: 'NetMission Ambassador & APSIG Fellow',
    desc: 'Mentored 50+ youth in Internet governance policy through the Asia Pacific School on Internet Governance.',
    tag: 'Mentorship',
  },
  {
    id: 'isoc',
    year: 'Ongoing',
    title: 'ISOC India, Delhi Chapter Contributor',
    desc: 'Active discussions on DNS governance and cybersecurity within the Internet Society Delhi Chapter.',
    tag: 'Community',
  },
  {
    id: 'cip',
    year: 'Ongoing',
    title: 'CIP CCG Contributor',
    desc: 'Community-led policy initiatives on cybersecurity and digital governance.',
    tag: 'Policy',
  },
];

export const SPEAKING_ENGAGEMENTS = [
  ...SPEAKING.map((item) => ({
    id: item.event.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    year: '2024',
    title: `${item.event} — ${item.location}`,
    desc: `${item.role} for a session on Internet governance, cybersecurity, policy, and digital rights.`,
    tag: item.role,
  })),
  {
    id: 'icann-apralo',
    year: 'Ongoing',
    title: 'ICANN APRALO & CIP CCG Contributor',
    desc: 'Contributing to discussions on community policy, cybersecurity, and DNS governance.',
    tag: 'Contributor',
  },
  {
    id: 'aces',
    year: 'Ongoing',
    title: 'ACES Group Contributor',
    desc: 'Thought leadership and strategic discussions on Internet governance.',
    tag: 'Contributor',
  },
];

export const EXPERIENCE_CARDS = [
  {
    icon: '📝',
    title: 'Technical Writing & Consulting',
    desc: 'Focus on tech policy, server infrastructure, and technical documentation. Regular analysis of NIST, ICANN, and IETF documents for non-specialist audiences.',
    tag: 'Technical Writing',
    tagColor: 'sky',
  },
  {
    icon: '🎙️',
    title: 'Conference Speaking & Moderation',
    desc: 'Moderator and speaker at UN IGF, Youth IGF India, APrIGF, and ICANN meetings on governance, cybersecurity, and digital rights.',
    tag: 'International Speaker',
    tagColor: 'amber',
  },
  {
    icon: '📚',
    title: 'Research & Policy Analysis',
    desc: "Author of analytical pieces on India's DPDP Act, influencer regulation, public interest technology, and DNS security.",
    tag: 'Policy Research',
    tagColor: 'sky',
  },
  {
    icon: '🤝',
    title: 'Community Capacity Building',
    desc: 'Trained youth in IG policy and governance. Led 5+ capacity-building workshops through YIGF India and APIGA India coordination.',
    tag: 'Community Work',
    tagColor: 'mint',
  },
  {
    icon: '🌐',
    title: 'Universal Acceptance Outreach',
    desc: 'Active advocate for Universal Acceptance of internationalised domain names for Indic scripts — enabling the next billion users.',
    tag: 'UA Champion',
    tagColor: 'sky',
  },
  {
    icon: '🔬',
    title: 'Digital Literacy & Empowerment',
    desc: 'Digital literacy and financial empowerment programs through IIRO, impacting 100+ individuals. Leading women empowerment initiatives through tech education.',
    tag: 'Social Impact',
    tagColor: 'mint',
  },
];
