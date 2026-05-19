/* --- CINEMATIC GALLERY ARCHIVE --- */
const GALLERY = [
  {src:'Gallery/Gallery/ICANN/APIGA India/APIGA 2025/1741502505106.jpg',event:'APIGA 2025'},
  {src:'Gallery/Gallery/ICANN/APIGA India/APIGA 2025/1743136115733.jpg',event:'APIGA 2025'},
  {src:'Gallery/Gallery/ICANN/APIGA India/APIGA 2026/1772292757218.jpg',event:'APIGA 2026'},
  {src:'Gallery/Gallery/ICANN/APIGA India/APIGA 2026/1772292757617.jpg',event:'APIGA 2026'},
  {src:'Gallery/Gallery/ICANN/APSIG and APrIGF/1724561263123.jpg',event:'APSIG and APrIGF'},
  {src:'Gallery/Gallery/ICANN/APSIG and APrIGF/1724561290827.jpg',event:'APSIG and APrIGF'},
  {src:'Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910070.jpg',event:'APSIG and APrIGF'},
  {src:'Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910663.jpg',event:'APSIG and APrIGF'},
  {src:'Gallery/Gallery/ICANN/APSIG and APrIGF/1724928910929.jpg',event:'APSIG and APrIGF'},
  {src:'Gallery/Gallery/ICANN/ICANN 78/1698580025753.jpg',event:'ICANN 78'},
  {src:'Gallery/Gallery/ICANN/ICANN 78/1698580026058.jpg',event:'ICANN 78'},
  {src:'Gallery/Gallery/ICANN/ICANN 78/1698580026745.jpg',event:'ICANN 78'},
  {src:'Gallery/Gallery/ICANN/ICANN 80/1718589109641.jpg',event:'ICANN 80'},
  {src:'Gallery/Gallery/ICANN/ICANN 80/1718796803124.jpg',event:'ICANN 80'},
  {src:'Gallery/Gallery/ICANN/ICANN 80/1718796803354.jpg',event:'ICANN 80'},
  {src:'Gallery/Gallery/ICANN/ICANN 80/1718796803586.jpg',event:'ICANN 80'},
  {src:'Gallery/Gallery/ICANN/ICANN 83/1750421773460.jpg',event:'ICANN 83'},
  {src:'Gallery/Gallery/ICANN/ICANN 83/1750421774356.jpg',event:'ICANN 83'},
  {src:'Gallery/Gallery/ICANN/ICANN 83/1750421776105.jpg',event:'ICANN 83'},
  {src:'Gallery/Gallery/ICANN/ICANN 83/1750421781926.jpg',event:'ICANN 83'},
  {src:'Gallery/Gallery/ICANN/ICANN 85/1773421025957.jpg',event:'ICANN 85'},
  {src:'Gallery/Gallery/ICANN/ICANN 85/1773421026446.jpg',event:'ICANN 85'},
  {src:'Gallery/Gallery/ICANN/ICANN 85/1773421026782.jpg',event:'ICANN 85'},
  {src:'Gallery/Gallery/ICANN/ICANN 85/1773421028250.jpg',event:'ICANN 85'},
  {src:'Gallery/Gallery/ICANN/ICANN 85/1773421031337.jpg',event:'ICANN 85'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1711086612412.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1731314588216.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1734708022916.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1749192182047.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1752556666396.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1762847692737.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1768535753033.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1769187886129.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Other Engagements/1771308022573.jpg',event:'Other Engagements'},
  {src:'Gallery/Gallery/ICANN/Regional APIGA/1756130315533.jpg',event:'Regional APIGA'},
  {src:'Gallery/Gallery/ICANN/Regional APIGA/1756130316217.jpg',event:'Regional APIGA'},
  {src:'Gallery/Gallery/ICANN/Youth IGF India/1728021832962.jpg',event:'Youth IGF India'},
  {src:'Gallery/Gallery/ICANN/Youth IGF India/1728831857039.jpg',event:'Youth IGF India'},
  {src:'Gallery/Gallery/ICANN/Youth IGF India/1759049821389.jpg',event:'Youth IGF India'},
];

const GALLERY_BASE = 'Gallery/Gallery/';
const GALLERY_START_PATH = ['ICANN'];

let galFiltered = [];
let lbIdx = 0;
let activeGalleryPath = GALLERY_START_PATH.slice();
let galleryTransitioning = false;

function resetGalleryScroll() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';

  if (window.Motion && typeof Motion.scrollToTop === 'function') {
    Motion.scrollToTop({ immediate: true });
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  } catch (error) {
    window.scrollTo(0, 0);
  }

  document.getElementById('page-gallery')?.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  document.getElementById('gal-surface')?.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });

  requestAnimationFrame(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function cleanGalleryName(name) {
  return String(name || 'Untitled Archive')
    .replace(/\s+folder$/i, '')
    .replace(/^icann\s+folder$/i, 'ICANN')
    .trim();
}

function createGalleryNode(name, path) {
  return {
    name: cleanGalleryName(name),
    path,
    children: new Map(),
    items: [],
    cover: null
  };
}

function getGalleryPathParts(item) {
  const normalized = item.src.replace(/\\/g, '/');
  const relative = normalized.includes(GALLERY_BASE)
    ? normalized.slice(normalized.indexOf(GALLERY_BASE) + GALLERY_BASE.length)
    : normalized;
  const parts = relative.split('/').filter(Boolean);
  parts.pop();
  return parts.map(cleanGalleryName);
}

function buildGalleryTree(items) {
  const root = createGalleryNode('Gallery', []);

  items.forEach((item, index) => {
    const pathParts = getGalleryPathParts(item);
    let node = root;

    pathParts.forEach((part, depth) => {
      if (!node.children.has(part)) {
        node.children.set(part, createGalleryNode(part, pathParts.slice(0, depth + 1)));
      }
      node = node.children.get(part);
    });

    const archiveItem = {
      ...item,
      index,
      pathParts,
      caption: cleanGalleryName(item.event || pathParts[pathParts.length - 1] || 'Gallery')
    };

    node.items.push(archiveItem);
  });

  hydrateGalleryCovers(root);
  return root;
}

function hydrateGalleryCovers(node) {
  const directCover = node.items[0] || null;
  const childCovers = Array.from(node.children.values()).map(hydrateGalleryCovers).filter(Boolean);
  node.cover = directCover || childCovers[0] || null;
  return node.cover;
}

const galleryTree = buildGalleryTree(GALLERY);

function encodeGalleryPath(pathParts) {
  return encodeURIComponent(JSON.stringify(pathParts || []));
}

function decodeGalleryPath(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return Array.isArray(parsed) ? parsed.map(cleanGalleryName) : [];
  } catch (error) {
    return String(value).split('|').filter(Boolean).map(cleanGalleryName);
  }
}

function getGalleryNode(pathParts = []) {
  return pathParts.reduce((node, part) => {
    return node && node.children ? node.children.get(cleanGalleryName(part)) : null;
  }, galleryTree);
}

function getNodeItems(node) {
  if (!node) return [];
  const nested = Array.from(node.children.values()).flatMap(child => getNodeItems(child));
  return [...node.items, ...nested];
}

function getFolderDetail(node) {
  const childCount = node.children.size;
  const photoCount = getNodeItems(node).length;
  const archiveLabel = childCount === 1 ? 'collection' : 'collections';
  const photoLabel = photoCount === 1 ? 'image' : 'images';

  if (childCount && photoCount) return `${childCount} ${archiveLabel} / ${photoCount} ${photoLabel}`;
  if (childCount) return `${childCount} ${archiveLabel}`;
  return `${photoCount} ${photoLabel}`;
}

function getFolderPreviewImages(node) {
  const direct = node.items.slice(0, 4);
  const nested = getNodeItems(node).slice(0, 4);
  return (direct.length ? direct : nested).slice(0, 4);
}

function getImageClass(index) {
  if (index % 13 === 0) return 'gal-item gal-item-hero';
  if (index % 11 === 0) return 'gal-item gal-item-large';
  if (index % 7 === 0) return 'gal-item gal-item-wide';
  if (index % 5 === 0) return 'gal-item gal-item-tall';
  return 'gal-item';
}

function preloadGalleryImages(items, limit = 3) {
  items.slice(0, limit).forEach(item => {
    const image = new Image();
    image.src = item.src;
  });
}

function renderBreadcrumb(pathParts) {
  const crumb = document.getElementById('gal-crumb');
  if (!crumb) return;

  const parts = [{ name: 'Gallery', path: [] }];
  pathParts.forEach((part, index) => {
    parts.push({ name: part, path: pathParts.slice(0, index + 1) });
  });

  crumb.innerHTML = parts.map((part, index) => {
    const isLast = index === parts.length - 1;
    const separator = isLast ? '' : '<span class="crumb-separator" aria-hidden="true">/</span>';
    if (isLast) return `<span class="crumb-current">${esc(part.name)}</span>`;
    return `<button class="crumb-link" data-gallery-path="${encodeGalleryPath(part.path)}">${esc(part.name)}</button>${separator}`;
  }).join('');
}

function renderArchiveHeader(node) {
  const title = document.getElementById('gal-title');
  const meta = document.getElementById('gal-meta');
  if (!title || !meta) return;

  title.textContent = node.path.length ? node.name : 'Gallery';
  meta.textContent = getFolderDetail(node);
}

function renderFolderCard(node, index) {
  const previews = getFolderPreviewImages(node);
  const previewMarkup = previews.length
    ? previews.map((item, previewIndex) => (
      `<img class="folder-preview-img" src="${esc(item.src)}" alt="" loading="lazy" decoding="async" style="--preview-index:${previewIndex}">`
    )).join('')
    : '<span class="folder-empty-preview"></span>';

  return `
    <button class="gal-folder" data-gallery-path="${encodeGalleryPath(node.path)}" style="--folder-delay:${index * 58}ms" aria-label="Open ${esc(node.name)}">
      <span class="folder-aura"></span>
      <span class="folder-sheen"></span>
      <span class="folder-stack" aria-hidden="true">${previewMarkup}</span>
      <span class="folder-meta">
        <span class="folder-name">${esc(node.name)}</span>
        <span class="folder-count">${esc(getFolderDetail(node))}</span>
        <span class="folder-action">Open</span>
      </span>
    </button>`;
}

function renderGalleryImages(items) {
  return items.map((item, index) => `
    <button class="${getImageClass(index)}" data-gallery-index="${index}" style="--photo-delay:${index * 34}ms" aria-label="Open ${esc(item.caption)} image ${index + 1}">
      <span class="gal-shimmer" aria-hidden="true"></span>
      <img class="gal-img" src="${esc(item.src)}" alt="${esc(item.caption)}" loading="lazy" decoding="async">
      <span class="gal-overlay">
        <span class="gal-label">${String(index + 1).padStart(2, '0')}</span>
      </span>
    </button>`).join('');
}

function markLoadedImages(scope) {
  scope.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
      img.closest('.gal-item,.gal-folder')?.classList.add('is-loaded');
    }
  });
}

function animateGallerySurface(foldersEl, grid) {
  const targets = [...foldersEl.querySelectorAll('.gal-folder'), ...grid.querySelectorAll('.gal-item')];
  if (!targets.length) return;

  if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(targets,
      { autoAlpha: 0, y: 30, scale: 0.975 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, ease: 'power3.out', stagger: 0.045 }
    );
  }
}

function renderGalleryPath(pathParts = GALLERY_START_PATH, options = {}) {
  if (options.resetScroll !== false) resetGalleryScroll();

  const requestedNode = getGalleryNode(pathParts);
  const fallbackNode = getGalleryNode(GALLERY_START_PATH) || galleryTree;
  const node = requestedNode || fallbackNode;
  const foldersEl = document.getElementById('gal-folders');
  const grid = document.getElementById('gal-grid');
  const surface = document.getElementById('gal-surface');
  if (!foldersEl || !grid) return;

  activeGalleryPath = node.path.slice();
  const childFolders = Array.from(node.children.values());
  galFiltered = node.items.slice();
  lbIdx = 0;

  renderBreadcrumb(activeGalleryPath);
  renderArchiveHeader(node);

  foldersEl.hidden = childFolders.length === 0;
  foldersEl.innerHTML = childFolders.map(renderFolderCard).join('');
  grid.classList.toggle('is-open', galFiltered.length > 0);
  grid.innerHTML = renderGalleryImages(galFiltered);
  surface?.classList.toggle('has-images', galFiltered.length > 0);
  surface?.classList.toggle('has-folders', childFolders.length > 0);

  markLoadedImages(foldersEl);
  markLoadedImages(grid);
  preloadGalleryImages(galFiltered);

  requestAnimationFrame(() => {
    if (options.resetScroll !== false) resetGalleryScroll();
    animateGallerySurface(foldersEl, grid);
    if (window.Motion) Motion.refresh();
  });
}

function openGalleryPath(pathParts, options = {}) {
  if (galleryTransitioning) return;
  resetGalleryScroll();

  const node = getGalleryNode(pathParts);
  if (!node) {
    renderGalleryPath(GALLERY_START_PATH, options);
    return;
  }

  const foldersEl = document.getElementById('gal-folders');
  const grid = document.getElementById('gal-grid');
  const currentItems = foldersEl && grid ? [...foldersEl.children, ...grid.children] : [];

  if (window.gsap && currentItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    galleryTransitioning = true;
    gsap.to(currentItems, {
      autoAlpha: 0,
      y: -12,
      scale: 0.975,
      duration: 0.2,
      ease: 'power2.out',
      stagger: 0.012,
      onComplete: () => {
        resetGalleryScroll();
        renderGalleryPath(node.path, options);
        galleryTransitioning = false;
      }
    });
    return;
  }

  renderGalleryPath(node.path, options);
}

function renderGalleryFolders() {
  renderGalleryPath(GALLERY_START_PATH, { resetScroll: false });
}

function renderGallery(filter) {
  if (!filter || filter === 'all') {
    renderGalleryFolders();
    return;
  }

  const activeNode = getGalleryNode(activeGalleryPath);
  const startNode = getGalleryNode(GALLERY_START_PATH) || galleryTree;
  const candidates = [
    ...(activeNode ? Array.from(activeNode.children.values()) : []),
    ...Array.from(startNode.children.values())
  ];
  const match = candidates.find(candidate => candidate.name === cleanGalleryName(filter));

  if (match) {
    openGalleryPath(match.path);
    return;
  }

  const eventMatch = GALLERY.find(item => cleanGalleryName(item.event) === cleanGalleryName(filter) || cleanGalleryName(item.folder) === cleanGalleryName(filter));
  resetGalleryScroll();
  renderGalleryPath(eventMatch ? getGalleryPathParts(eventMatch) : GALLERY_START_PATH);
}

function filterGal(filter, btn) {
  document.querySelectorAll('.gf').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  resetGalleryScroll();
  renderGallery(filter);
}

function bindGalleryEvents() {
  const page = document.getElementById('page-gallery');
  if (!page || page.dataset.galleryReady) return;
  page.dataset.galleryReady = 'true';

  page.addEventListener('click', event => {
    const pathButton = event.target.closest('[data-gallery-path]');
    if (pathButton) {
      event.preventDefault();
      event.stopPropagation();
      openGalleryPath(decodeGalleryPath(pathButton.dataset.galleryPath));
      return;
    }

    const home = event.target.closest('[data-gallery-home]');
    if (home) {
      event.preventDefault();
      event.stopPropagation();
      renderGalleryFolders();
    }
  });

  page.addEventListener('pointermove', event => {
    const folder = event.target.closest('.gal-folder');
    if (!folder) return;
    const rect = folder.getBoundingClientRect();
    folder.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    folder.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }, { passive: true });
}

document.addEventListener('load', event => {
  if (event.target.matches('.gal-img,.folder-preview-img,.lb-img')) {
    event.target.classList.add('is-loaded');
    event.target.closest('.gal-item,.gal-folder')?.classList.add('is-loaded');
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  bindGalleryEvents();
  renderGalleryFolders();
});

window.renderGalleryFolders = renderGalleryFolders;
window.renderGallery = renderGallery;
window.filterGal = filterGal;
window.openGalleryPath = openGalleryPath;
window.decodeGalleryPath = decodeGalleryPath;
window.resetGalleryScroll = resetGalleryScroll;
