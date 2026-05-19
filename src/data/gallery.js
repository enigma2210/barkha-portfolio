import { ICANN85_EVENT, ICANN_EVENTS } from './siteData';

const icannLabel = (name) => name.replace('ICANN', 'ICANN ');
const ICANN_LABELS = ICANN_EVENTS
  .filter((event) => event.name !== ICANN85_EVENT.name)
  .map((event) => icannLabel(event.name));
const ICANN85_LABEL = `${ICANN85_EVENT.name} — ${ICANN85_EVENT.location}`;

export const GALLERY = [
  { cat: 'APIGA India', sub: 'APIGA 2025', src: '/Gallery/Gallery/ICANN/APIGA India/APIGA 2025/1741502505106.jpg' },
  { cat: 'APIGA India', sub: 'APIGA 2025', src: '/Gallery/Gallery/ICANN/APIGA India/APIGA 2025/1743136115733.jpg' },
  { cat: 'APIGA India', sub: 'APIGA 2026', src: '/Gallery/Gallery/ICANN/APIGA India/APIGA 2026/1772292757218.jpg' },
  { cat: 'APIGA India', sub: 'APIGA 2026', src: '/Gallery/Gallery/ICANN/APIGA India/APIGA 2026/1772292757617.jpg' },
  { cat: 'APSIG and APrIGF', sub: 'APSIG and APrIGF', src: '/Gallery/Gallery/ICANN/APSIG and APrIGF/1724561263123.jpg' },
  { cat: 'APSIG and APrIGF', sub: 'APSIG and APrIGF', src: '/Gallery/Gallery/ICANN/APSIG and APrIGF/1724561290827.jpg' },
  { cat: 'APSIG and APrIGF', sub: 'APSIG and APrIGF', src: '/Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910070.jpg' },
  { cat: 'APSIG and APrIGF', sub: 'APSIG and APrIGF', src: '/Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910663.jpg' },
  { cat: 'APSIG and APrIGF', sub: 'APSIG and APrIGF', src: '/Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910929.jpg' },
  { cat: ICANN_LABELS[0], sub: ICANN_LABELS[0], src: '/Gallery/Gallery/ICANN/ICANN 78/1698580025753.jpg' },
  { cat: ICANN_LABELS[0], sub: ICANN_LABELS[0], src: '/Gallery/Gallery/ICANN/ICANN 78/1698580026058.jpg' },
  { cat: ICANN_LABELS[0], sub: ICANN_LABELS[0], src: '/Gallery/Gallery/ICANN/ICANN 78/1698580026745.jpg' },
  { cat: ICANN_LABELS[1], sub: ICANN_LABELS[1], src: '/Gallery/Gallery/ICANN/ICANN 80/1718589109641.jpg' },
  { cat: ICANN_LABELS[1], sub: ICANN_LABELS[1], src: '/Gallery/Gallery/ICANN/ICANN 80/1718796803124.jpg' },
  { cat: ICANN_LABELS[1], sub: ICANN_LABELS[1], src: '/Gallery/Gallery/ICANN/ICANN 80/1718796803354.jpg' },
  { cat: ICANN_LABELS[1], sub: ICANN_LABELS[1], src: '/Gallery/Gallery/ICANN/ICANN 80/1718796803586.jpg' },
  { cat: ICANN_LABELS[2], sub: ICANN_LABELS[2], src: '/Gallery/Gallery/ICANN/ICANN 83/1750421773460.jpg' },
  { cat: ICANN_LABELS[2], sub: ICANN_LABELS[2], src: '/Gallery/Gallery/ICANN/ICANN 83/1750421774356.jpg' },
  { cat: ICANN_LABELS[2], sub: ICANN_LABELS[2], src: '/Gallery/Gallery/ICANN/ICANN 83/1750421776105.jpg' },
  { cat: ICANN_LABELS[2], sub: ICANN_LABELS[2], src: '/Gallery/Gallery/ICANN/ICANN 83/1750421781926.jpg' },
  { cat: ICANN85_LABEL, sub: ICANN85_LABEL, src: '/Gallery/Gallery/ICANN/ICANN 85/1773421025957.jpg' },
  { cat: ICANN85_LABEL, sub: ICANN85_LABEL, src: '/Gallery/Gallery/ICANN/ICANN 85/1773421026446.jpg' },
  { cat: ICANN85_LABEL, sub: ICANN85_LABEL, src: '/Gallery/Gallery/ICANN/ICANN 85/1773421026782.jpg' },
  { cat: ICANN85_LABEL, sub: ICANN85_LABEL, src: '/Gallery/Gallery/ICANN/ICANN 85/1773421028250.jpg' },
  { cat: ICANN85_LABEL, sub: ICANN85_LABEL, src: '/Gallery/Gallery/ICANN/ICANN 85/1773421031337.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1711086612412.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1731314588216.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1734708022916.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1749192182047.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1752556666396.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1762847692737.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1768535753033.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1769187886129.jpg' },
  { cat: 'Other Engagements', sub: 'Other Engagements', src: '/Gallery/Gallery/ICANN/Other Engagements/1771308022573.jpg' },
  { cat: 'Regional APIGA', sub: 'Regional APIGA', src: '/Gallery/Gallery/ICANN/Regional APIGA/1756130315533.jpg' },
  { cat: 'Regional APIGA', sub: 'Regional APIGA', src: '/Gallery/Gallery/ICANN/Regional APIGA/1756130316217.jpg' },
  { cat: 'Youth IGF India', sub: 'Youth IGF India', src: '/Gallery/Gallery/ICANN/Youth IGF India/1728021832962.jpg' },
  { cat: 'Youth IGF India', sub: 'Youth IGF India', src: '/Gallery/Gallery/ICANN/Youth IGF India/1728831857039.jpg' },
  { cat: 'Youth IGF India', sub: 'Youth IGF India', src: '/Gallery/Gallery/ICANN/Youth IGF India/1759049821389.jpg' },
];

export const FOLDERS = [
  { name: 'APIGA India', count: 4, subfolders: ['APIGA 2025', 'APIGA 2026'] },
  { name: 'APSIG and APrIGF', count: 5, subfolders: [] },
  { name: ICANN_LABELS[0], count: 3, subfolders: [] },
  { name: ICANN_LABELS[1], count: 4, subfolders: [] },
  { name: ICANN_LABELS[2], count: 4, subfolders: [] },
  { name: ICANN85_LABEL, count: 5, subfolders: [] },
  { name: 'Regional APIGA', count: 2, subfolders: [] },
  { name: 'Youth IGF India', count: 3, subfolders: [] },
  { name: 'Other Engagements', count: 9, subfolders: [] },
];

export function getFolderImages(folderName) {
  return GALLERY.filter((item) => item.cat === folderName);
}
