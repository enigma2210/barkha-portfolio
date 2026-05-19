// src/data/siteData.js
// SINGLE SOURCE OF TRUTH - All factual data about Barkha Manral
// Sourced from barkhamanral.in - verified May 2026

export const PERSON = {
  nameEn: 'Barkha Manral',
  nameHi: 'बरखा मनराल',
  tagline: 'Internet Governance · Policy · Advocacy',
  quote: 'Have Pride in how far you have come, Have faith in how far you can go!!',
  signoff: 'Founder, IIRO | Tech Policy & Community Engagement Advocate',
  profileTitle: 'Founder, IIRO | Internet Governance Advocate',
  email: 'info@barkhamanral.in',
  website: 'https://barkhamanral.in',
  linkedin: 'https://www.linkedin.com/in/barkha-manral/',
  twitter: 'https://twitter.com/manralbarkha',
  github: 'https://github.com/barkha1296',
  icann: 'https://community.icann.org',
};

export const ORGS = {
  iiro: {
    name: 'India Internet Research Organisation',
    short: 'IIRO',
    url: 'https://www.iiro.in',
    role: 'Founder',
    desc: 'Digital literacy & financial empowerment programs, impacting 100+ individuals. Leading women empowerment initiatives through tech education.',
  },
  soch: {
    name: 'Social Organization for Connecting Happiness',
    short: 'SOCH',
    url: 'https://sochorganization.com',
    role: 'Member',
    desc: 'Social Organisation for Community Resilience and Digital Equity - Member. Contributing to digital equity and community capacity building initiatives.',
  },
};

export const ICANN_EVENTS = [
  {
    name: 'ICANN78',
    role: 'Fellow',
  },
  {
    name: 'ICANN80',
    role: 'Fellow',
  },
  {
    name: 'ICANN83',
    role: 'Fellow',
  },
  {
    name: 'ICANN85',
    role: 'Mentor',
    location: 'Mumbai, India',
    year: 2026,
  },
];

export const ICANN_FELLOWSHIP_EVENTS = ICANN_EVENTS.filter((event) => event.name !== 'ICANN85');
export const ICANN85_EVENT = ICANN_EVENTS.find((event) => event.name === 'ICANN85');
// ICANN78, ICANN80, ICANN83 = Fellow (NextGen@ICANN)
// ICANN85 (Mumbai, March 2026) = Mentor for Fellows, not a fellow herself
export const ICANN_MEETINGS = ['ICANN78', 'ICANN80', 'ICANN83', 'ICANN85'];
export const ICANN_ROLES = {
  ICANN78: 'Fellow',
  ICANN80: 'Fellow',
  ICANN83: 'Fellow',
  ICANN85: 'Mentor',
};

export const SPEAKING = [
  { event: 'United Nations IGF 2024', location: 'Riyadh', role: 'Moderator' },
  { event: 'Youth IGF India 2024', location: 'India', role: 'Moderator' },
  { event: 'APrIGF 2024', location: 'Asia Pacific', role: 'Moderator' },
];

export const HERO_BIO = `I'm Barkha — founder of the India Internet Research Organisation (iiro.in) and a tech policy enthusiast with a deep interest in cybersecurity, digital rights, and inclusive Internet governance. This space is my serendipity vehicle — where personal reflections meet professional insights. From navigating global policy forums like ICANN and APSIG to engaging with youth through YIGF and local APIGA India, I share stories, thoughts, and learnings from the evolving tech ecosystem. Whether you're a fellow policy thinker, a curious learner, or just here for thoughtful musings, I hope you find something that sparks your interest. Let's explore, question, and grow — together.`;

export const PORTFOLIO_BIO = `I am an Internet governance advocate, tech policy enthusiast, and founder of the India Internet Research Organisation (IIRO). With over six years of experience in technical consulting, documentation, and community engagement, I specialize in bridging technology and policy to create inclusive digital ecosystems. As an ICANN and APSIG Fellow, YIGF Organizer, and Program Coordinator for Local APIGA India, I contribute actively to global Internet governance discussions. In my role as a Technical Writer & Consultant, I focus on tech policy, server infrastructure, and technical documentation. Beyond my professional work, I am passionate about writing, research, and community-driven initiatives. My insights on cybersecurity, data governance, and digital rights are published here on my website.`;

export const PORTFOLIO_CLOSING = `I am committed to bridging the gap between technology, policy, and governance to create a more inclusive and secure digital future. My goal is to expand access to upskilling initiatives in India and globally.`;

export const STATS = [
  { n: 5, suffix: '+', label: 'ICANN Engagements' },
  { n: 3, suffix: '+', label: 'Years Active' },
  { n: 1, suffix: '', label: 'Org Founded' },
  { n: 15, suffix: '+', label: 'Forum Talks' },
];
