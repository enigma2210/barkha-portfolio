import { ORGS } from './siteData';
import apigaLogo from '../../Gallery/Gallery/Logos/APIGA.png';
import apsigLogo from '../../Gallery/Gallery/Logos/APSIG.png';
import icannLogo from '../../Gallery/Gallery/Logos/ICANN.png';
import iiroLogo from '../../Gallery/Gallery/Logos/IIRO.png';
import isocLogo from '../../Gallery/Gallery/Logos/ISOC.png';
import netMissionLogo from '../../Gallery/Gallery/Logos/NetMission.png';
import sochLogo from '../../Gallery/Gallery/Logos/SOCH.png';
import yigfLogo from '../../Gallery/Gallery/Logos/YIGF.png';

export const AFFILIATIONS = [
  {
    id: 'icann',
    logo: 'ICANN',
    logoSrc: icannLogo,
    color: 'linear-gradient(135deg, #1563B2, #0E4D8F)',
    name: 'ICANN Fellow & Mentor',
    desc: 'ICANN 78, 80, 83 - Fellow. ICANN 85 (Mumbai, 2026) - Mentor for ICANN Fellows. Contributing to DNS security policies and global Internet governance across multiple ICANN cycles.',
  },
  {
    id: 'yigf',
    logo: 'YIGF',
    logoSrc: yigfLogo,
    color: 'linear-gradient(135deg, #0D9488, #2DD4BF)',
    name: 'Youth IGF Speaker',
    desc: 'Youth Internet Governance Forum - Speaker on digital inclusion and South Asian internet governance challenges',
  },
  {
    id: 'apsig',
    logo: 'APSIG',
    logoSrc: apsigLogo,
    color: 'linear-gradient(135deg, #1563B2, #3B9AE8)',
    name: 'APSIG Participant',
    desc: 'Asia Pacific School on Internet Governance - Researcher and panelist on regional internet policy',
  },
  {
    id: 'apiga',
    logo: 'APIGA',
    logoSrc: apigaLogo,
    color: 'linear-gradient(135deg, #0E4D8F, #1E7ED4)',
    name: 'APIGA India Coordinator',
    desc: 'Asia Pacific Internet Governance Academy India - Programme Coordinator, training the next generation of Internet governance advocates across India.',
  },
  {
    id: 'isoc',
    logo: 'ISOC',
    logoSrc: isocLogo,
    color: 'linear-gradient(135deg, #C59A4A, #E8D7AD)',
    name: 'ISOC Member',
    desc: 'Internet Society - Member, ISOC India, Delhi Chapter. Advocacy for open internet standards and digital rights',
  },
  {
    id: 'netmission',
    logo: 'NetMission',
    logoSrc: netMissionLogo,
    color: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    name: 'NetMission Ambassador',
    desc: 'NetMission - Youth internet governance ambassador program connecting Asia Pacific youth to global forums',
  },
  {
    id: 'iiro',
    logo: 'IIRO',
    logoSrc: iiroLogo,
    color: 'linear-gradient(135deg, #16A34A, #15803D)',
    name: 'IIRO Founder',
    desc: `${ORGS.iiro.name} - ${ORGS.iiro.role}. Bridging rural communities and digital policy`,
  },
  {
    id: 'soch',
    logo: 'SOCH',
    logoSrc: sochLogo,
    color: 'linear-gradient(135deg, #1E7ED4, #0E4D8F)',
    name: 'SOCH Member',
    desc: 'Social Organisation for Community Resilience and Digital Equity - Member, contributing to digital equity and community capacity building.',
  },
];
