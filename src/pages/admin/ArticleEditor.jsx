import { useEffect, useRef, useState } from 'react';
import {
  deleteArticle,
  getArticlePath,
  getEditableArticles,
  saveArticle,
} from '../../services/articleService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { toSlug } from '../../utils/urlRouter';

const EMPTY_ARTICLE = {
  id: '',
  title: '',
  slug: '',
  cat: '',
  category: '',
  date: '',
  dateRaw: '',
  excerpt: '',
  body: '<p><br></p>',
  status: 'draft',
  coverImage: '',
  coverFit: 'cover',
  tags: [],
  authorName: 'Barkha Manral',
  seo: {
    metaTitle: '',
    metaDescription: '',
    openGraphImage: '',
    canonicalUrl: '',
  },
};

const TOOLBAR = [
  { cmd: 'undo', icon: 'Undo', title: 'Undo' },
  { cmd: 'redo', icon: 'Redo', title: 'Redo' },
  { sep: true },
  { cmd: 'bold', icon: 'B', title: 'Bold' },
  { cmd: 'italic', icon: 'I', title: 'Italic' },
  { cmd: 'underline', icon: 'U', title: 'Underline' },
  { cmd: 'strikeThrough', icon: 'S', title: 'Strikethrough' },
  { action: 'inlineCode', icon: 'Code', title: 'Inline code' },
  { cmd: 'removeFormat', icon: 'Clear', title: 'Clear formatting' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h1', icon: 'H1', title: 'Heading 1' },
  { cmd: 'formatBlock', arg: 'h2', icon: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', arg: 'h3', icon: 'H3', title: 'Heading 3' },
  { cmd: 'formatBlock', arg: 'h4', icon: 'H4', title: 'Heading 4' },
  { cmd: 'formatBlock', arg: 'p', icon: 'P', title: 'Paragraph' },
  { cmd: 'formatBlock', arg: 'blockquote', icon: 'Quote', title: 'Blockquote' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: 'List', title: 'Bullet List' },
  { cmd: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
  { action: 'hr', icon: 'HR', title: 'Divider' },
  { sep: true },
  { action: 'link', icon: 'Link', title: 'Add or edit link (Ctrl+K)' },
  { action: 'unlink', icon: 'Unlink', title: 'Remove link' },
  { action: 'image', icon: 'Image', title: 'Insert image' },
  { action: 'imageUrl', icon: 'Img URL', title: 'Insert image from URL' },
  { action: 'embed', icon: 'Embed', title: 'Embed YouTube or Vimeo' },
];

const CALLOUT_TYPES = [
  { type: 'note', label: 'Note', heading: 'Note' },
  { type: 'warning', label: 'Warning', heading: 'Warning' },
  { type: 'insight', label: 'Insight', heading: 'Insight' },
  { type: 'highlight', label: 'Highlight', heading: 'Highlight' },
];

const inputStyle = {
  width: '100%',
  padding: '0.62rem 0.9rem',
  border: '1px solid var(--bg-sky-50)',
  borderRadius: 'var(--r-sm)',
  fontSize: '0.9rem',
  color: 'var(--text-body)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
  background: 'white',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.76rem',
  fontWeight: 600,
  color: 'var(--text-mid)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function readingTime(html) {
  return Math.max(1, Math.ceil(wordCount(html) / 200));
}

function excerptFromBody(html) {
  const text = stripHtml(html);
  return text.length > 160 ? `${text.slice(0, 160).trim()}...` : text;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function textToParagraphHtml(text = '') {
  return String(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function cleanPastedHtml(html = '') {
  const safeHtml = sanitizeHtml(html);
  if (typeof window === 'undefined' || !window.DOMParser) return safeHtml;

  const doc = new window.DOMParser().parseFromString(safeHtml, 'text/html');
  doc.body.querySelectorAll('*').forEach((node) => {
    node.removeAttribute('style');
    if (node.tagName === 'SPAN' && !node.attributes.length) {
      node.replaceWith(...Array.from(node.childNodes));
    }
  });
  return doc.body.innerHTML;
}

function normalizeEditorLinkUrl(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return { error: 'Enter a link URL.' };

  if (raw.startsWith('/') || raw.startsWith('#')) return { url: raw };
  if (/^(mailto:|tel:)/i.test(raw)) return { url: raw };

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  if (!/^https:\/\//i.test(withProtocol)) {
    return { error: 'External links must use HTTPS.' };
  }

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'https:') return { error: 'External links must use HTTPS.' };
    return { url: parsed.href };
  } catch {
    return { error: 'Enter a valid HTTPS, internal, mailto, or tel link.' };
  }
}

function isExternalEditorLink(url = '') {
  if (!/^https:\/\//i.test(url)) return false;
  if (typeof window === 'undefined') return true;

  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return true;
  }
}

function applyLinkAttributes(anchor, href) {
  anchor.setAttribute('href', href);
  if (isExternalEditorLink(href)) {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  } else {
    anchor.removeAttribute('target');
    anchor.setAttribute('rel', 'noopener');
  }
}

function closestAnchor(node, root) {
  let element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  while (element && element !== root) {
    if (element.tagName === 'A') return element;
    element = element.parentElement;
  }
  return null;
}

function getSelectedAnchor(root) {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !root) return null;

  const range = selection.getRangeAt(0);
  return closestAnchor(selection.anchorNode, root)
    || closestAnchor(selection.focusNode, root)
    || closestAnchor(range.commonAncestorContainer, root);
}

function normalizeEmbedUrl(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return { error: 'Paste a YouTube or Vimeo URL.' };

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  if (!/^https:\/\//i.test(withProtocol)) return { error: 'Embeds must use HTTPS.' };

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id) return { url: `https://www.youtube.com/embed/${id}` };
    }

    if (host === 'youtube.com') {
      if (url.pathname.startsWith('/embed/')) return { url: url.href };
      const id = url.searchParams.get('v');
      if (id) return { url: `https://www.youtube.com/embed/${id}` };
    }

    if (host === 'vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id) return { url: `https://player.vimeo.com/video/${id}` };
    }

    if (host === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
      return { url: url.href };
    }
  } catch {
    return { error: 'Enter a valid YouTube or Vimeo URL.' };
  }

  return { error: 'Only YouTube and Vimeo embeds are supported.' };
}

function normalizeForEditor(article) {
  return {
    ...EMPTY_ARTICLE,
    ...article,
    cat: article.cat || article.category || '',
    category: article.category || article.cat || '',
    coverImage: article.coverImage || article.featuredImage || '',
    body: article.body || article.content || '<p><br></p>',
    seo: {
      ...EMPTY_ARTICLE.seo,
      ...(article.seo || {}),
    },
  };
}

export function ArticleEditor({ showToast }) {
  const [mode, setMode] = useState('list');
  const [articles, setArticles] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  const [lastPublishedUrl, setLastPublishedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [linkModal, setLinkModal] = useState({
    open: false,
    url: '',
    text: '',
    isEditing: false,
    error: '',
  });
  const editorRef = useRef(null);
  const coverInputRef = useRef(null);
  const bodyImageInputRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const activeLinkRef = useRef(null);

  async function loadArticles() {
    setLoading(true);
    try {
      const next = await getEditableArticles();
      setArticles(next);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load articles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && editorRef.current && current) {
      editorRef.current.innerHTML = current.body || '<p><br></p>';
    }
  }, [mode, current?.id]);

  function syncEditorBody(options = {}) {
    const body = sanitizeHtml(editorRef.current?.innerHTML || '<p><br></p>');
    if (options.rewrite && editorRef.current && editorRef.current.innerHTML !== body) {
      editorRef.current.innerHTML = body;
    }
    setCurrent((article) => (article ? { ...article, body } : article));
  }

  function editorContainsRange(range) {
    if (!editorRef.current || !range) return false;
    const node = range.commonAncestorContainer;
    return editorRef.current.contains(node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode);
  }

  function saveEditorSelection() {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (editorContainsRange(range)) {
      savedSelectionRef.current = range.cloneRange();
    }
  }

  function restoreEditorSelection() {
    const range = savedSelectionRef.current;
    if (!range || !editorContainsRange(range)) return false;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  function createBlankArticle() {
    return {
      ...EMPTY_ARTICLE,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }

  function insertHtmlAtSelection(html) {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, sanitizeHtml(html));
    syncEditorBody();
  }

  function wrapSelectionWithTag(tagName) {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!editorContainsRange(range) || range.collapsed) return;

    const wrapper = document.createElement(tagName);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    range.setStartAfter(wrapper);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    syncEditorBody({ rewrite: true });
  }

  function openLinkModal() {
    editorRef.current?.focus();
    saveEditorSelection();

    const anchor = getSelectedAnchor(editorRef.current);
    activeLinkRef.current = anchor;

    const selection = window.getSelection();
    const selectedText = anchor?.textContent || (selection?.rangeCount ? selection.toString() : '');
    setLinkModal({
      open: true,
      url: anchor?.getAttribute('href') || '',
      text: selectedText || '',
      isEditing: Boolean(anchor),
      error: '',
    });
  }

  function closeLinkModal() {
    activeLinkRef.current = null;
    setLinkModal({ open: false, url: '', text: '', isEditing: false, error: '' });
  }

  function applyLink(event) {
    event.preventDefault();
    const normalized = normalizeEditorLinkUrl(linkModal.url);
    if (normalized.error) {
      setLinkModal((modal) => ({ ...modal, error: normalized.error }));
      return;
    }

    editorRef.current?.focus();
    const text = linkModal.text.trim();
    const existingAnchor = activeLinkRef.current;

    if (existingAnchor && editorRef.current?.contains(existingAnchor)) {
      applyLinkAttributes(existingAnchor, normalized.url);
      if (text) existingAnchor.textContent = text;
      syncEditorBody({ rewrite: true });
      closeLinkModal();
      return;
    }

    restoreEditorSelection();
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const anchor = document.createElement('a');
    applyLinkAttributes(anchor, normalized.url);

    if (range && editorContainsRange(range) && !range.collapsed) {
      anchor.appendChild(range.extractContents());
      if (!anchor.textContent.trim() && text) anchor.textContent = text;
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      anchor.textContent = text || normalized.url;
      if (range && editorContainsRange(range)) {
        range.insertNode(anchor);
        range.setStartAfter(anchor);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current?.appendChild(anchor);
      }
    }

    syncEditorBody({ rewrite: true });
    closeLinkModal();
  }

  function removeLinkFromEditor() {
    editorRef.current?.focus();
    const existingAnchor = activeLinkRef.current;

    if (existingAnchor && editorRef.current?.contains(existingAnchor)) {
      const parent = existingAnchor.parentNode;
      while (existingAnchor.firstChild) parent.insertBefore(existingAnchor.firstChild, existingAnchor);
      parent.removeChild(existingAnchor);
    } else {
      restoreEditorSelection();
      document.execCommand('unlink');
    }

    syncEditorBody({ rewrite: true });
    closeLinkModal();
  }

  function insertImageBlock(src, caption = '') {
    insertHtmlAtSelection(`
      <figure class="article-image">
        <img src="${escapeAttr(src)}" alt="${escapeAttr(caption || 'Article image')}" />
        <figcaption>${escapeHtml(caption || 'Image caption')}</figcaption>
      </figure>
      <p><br></p>
    `);
  }

  function handleBodyImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 8 * 1024 * 1024) {
      window.alert('Image must be under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const caption = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      restoreEditorSelection();
      insertImageBlock(event.target.result, caption);
    };
    reader.readAsDataURL(file);
  }

  function insertImageFromUrl() {
    const raw = window.prompt('Paste an HTTPS image URL');
    if (!raw) return;

    const normalized = normalizeEditorLinkUrl(raw);
    if (normalized.error || !/^https:\/\//i.test(normalized.url)) {
      window.alert('Image URLs must be valid HTTPS links.');
      return;
    }

    restoreEditorSelection();
    insertImageBlock(normalized.url, 'Image caption');
  }

  function insertEmbed() {
    const raw = window.prompt('Paste a YouTube or Vimeo URL');
    if (!raw) return;

    const normalized = normalizeEmbedUrl(raw);
    if (normalized.error) {
      window.alert(normalized.error);
      return;
    }

    restoreEditorSelection();
    insertHtmlAtSelection(`
      <figure class="article-embed">
        <iframe
          src="${escapeAttr(normalized.url)}"
          title="Embedded media"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <figcaption>Media caption</figcaption>
      </figure>
      <p><br></p>
    `);
  }

  function insertCallout(type = 'note') {
    const callout = CALLOUT_TYPES.find((item) => item.type === type) || CALLOUT_TYPES[0];
    insertHtmlAtSelection(`
      <div class="art-callout callout-${escapeAttr(callout.type)}">
        <p><strong>${escapeHtml(callout.heading)}:</strong> Add your ${escapeHtml(callout.label.toLowerCase())} here.</p>
      </div>
      <p><br></p>
    `);
  }

  function runToolbarAction(button) {
    if (button.action === 'link') {
      openLinkModal();
      return;
    }

    if (button.action === 'unlink') {
      editorRef.current?.focus();
      document.execCommand('unlink');
      syncEditorBody({ rewrite: true });
      return;
    }

    if (button.action === 'inlineCode') {
      wrapSelectionWithTag('code');
      return;
    }

    if (button.action === 'hr') {
      editorRef.current?.focus();
      document.execCommand('insertHorizontalRule');
      syncEditorBody();
      return;
    }

    if (button.action === 'image') {
      saveEditorSelection();
      bodyImageInputRef.current?.click();
      return;
    }

    if (button.action === 'imageUrl') {
      saveEditorSelection();
      insertImageFromUrl();
      return;
    }

    if (button.action === 'embed') {
      saveEditorSelection();
      insertEmbed();
      return;
    }

    editorRef.current?.focus();
    if (button.arg) document.execCommand(button.cmd, false, button.arg);
    else document.execCommand(button.cmd);
    syncEditorBody();
  }

  function handleEditorPaste(event) {
    event.preventDefault();
    const html = event.clipboardData?.getData('text/html');
    const text = event.clipboardData?.getData('text/plain');
    insertHtmlAtSelection(html ? cleanPastedHtml(html) : textToParagraphHtml(text));
  }

  function handleEditorKeyDown(event) {
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openLinkModal();
    }
  }

  function handleCoverFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 8 * 1024 * 1024) {
      window.alert('Image must be under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPreview(event.target.result);
      setCurrent((article) => ({
        ...article,
        coverImage: event.target.result,
        seo: {
          ...article.seo,
          openGraphImage: article.seo?.openGraphImage || event.target.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  }

  async function saveCurrent(status) {
    if (!current?.title?.trim()) {
      window.alert('Article title is required.');
      return;
    }

    setSaving(true);
    const body = sanitizeHtml(editorRef.current?.innerHTML || current.body || '<p><br></p>');
    const draft = {
      ...current,
      slug: current.slug || toSlug(current.title),
      category: current.cat || current.category,
      cat: current.cat || current.category,
      body,
      excerpt: current.excerpt || excerptFromBody(body),
      status,
    };

    try {
      const saved = await saveArticle(draft, status);
      const normalized = normalizeForEditor(saved);
      setCurrent(normalized);
      await loadArticles();
      showToast?.(status === 'published' ? 'Article published globally.' : 'Draft saved to database.');

      if (status === 'published') {
        setLastPublishedUrl(`${window.location.origin}${getArticlePath(saved)}`);
        setCopiedUrl(false);
        setMode('list');
      }
    } catch (err) {
      window.alert(err.message || 'Unable to save article.');
    } finally {
      setSaving(false);
    }
  }

  async function removeArticle(id) {
    if (!window.confirm('Delete this article from the database? This cannot be undone.')) return;

    try {
      await deleteArticle(id);
      await loadArticles();
      showToast?.('Article deleted.');
    } catch (err) {
      window.alert(err.message || 'Unable to delete article.');
    }
  }

  async function copyPublishedUrl() {
    if (!lastPublishedUrl) return;

    try {
      await navigator.clipboard.writeText(lastPublishedUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      window.prompt('Copy article URL:', lastPublishedUrl);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-content-card">
        <h2>Article database not configured</h2>
        <p className="admin-muted">
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, run `supabase/schema.sql`,
          and deploy those environment variables to enable global publishing.
        </p>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--sky-900)', margin: 0 }}>
              Articles
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {articles.length} database article{articles.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { const blank = createBlankArticle(); setCurrent(blank); setCoverPreview(null); setMode('edit'); }}
            style={{
              background: 'linear-gradient(135deg, #1563B2, #14B8A6)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--r-full)',
              padding: '0.65rem 1.5rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            + New Article
          </button>
        </div>

        {lastPublishedUrl ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '1rem 1.2rem',
            marginBottom: '1.4rem',
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.22)',
            borderRadius: 'var(--r-md)',
          }}>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: 'block', color: 'var(--teal-600)', fontSize: '0.86rem' }}>
                Published article URL
              </strong>
              <a
                href={lastPublishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', color: 'var(--text-body)', fontSize: '0.82rem', overflowWrap: 'anywhere' }}
              >
                {lastPublishedUrl}
              </a>
            </div>
            <button
              type="button"
              onClick={copyPublishedUrl}
              style={{
                flexShrink: 0,
                background: copiedUrl ? 'var(--teal-600)' : 'white',
                color: copiedUrl ? 'white' : 'var(--teal-600)',
                border: '1px solid rgba(20,184,166,0.28)',
                borderRadius: 'var(--r-full)',
                padding: '0.5rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copiedUrl ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        ) : null}

        {loading ? <p className="admin-muted">Loading database articles...</p> : null}
        {error ? <div className="admin-error-banner">{error}</div> : null}

        {!loading && !articles.length ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem' }}>No articles in the database yet</p>
            <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>Create and publish one to make it globally visible.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {articles.map((article) => (
              <div
                key={article.id}
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '1.1rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: 'var(--s1)',
                }}
              >
                {article.coverImage ? (
                  <img src={article.coverImage} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--r-sm)', background: 'var(--bg-sky-light)', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>
                    {article.category || 'Uncategorised'}
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {article.title || 'Untitled'}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {article.slug} · {article.status === 'published' ? 'Published' : 'Draft'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {article.status === 'published' ? (
                    <a className="act-btn act-view" href={getArticlePath(article)} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  ) : null}
                  <button type="button" onClick={() => { const normalized = normalizeForEditor(article); setCurrent(normalized); setCoverPreview(normalized.coverImage); setMode('edit'); }}
                    style={{ fontSize: '0.76rem', fontWeight: 600, padding: '0.32rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-sky-light)', border: '1px solid var(--border)', color: 'var(--sky-700)', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => removeArticle(article.id)}
                    style={{ fontSize: '0.76rem', fontWeight: 600, padding: '0.32rem 0.75rem', borderRadius: 'var(--r-sm)', background: '#FEE2E2', border: '1px solid #FECACA', color: '#B91C1C', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mode === 'edit' && current) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <button type="button" onClick={() => setMode('list')}
            style={{ fontSize: '0.82rem', color: 'var(--sky-600)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Back to Articles
          </button>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="button" disabled={saving} onClick={() => saveCurrent('draft')}
              style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0.45rem 1.1rem', borderRadius: 'var(--r-full)', background: 'var(--bg-sky-light)', border: '1px solid var(--border)', color: 'var(--sky-700)', cursor: 'pointer' }}>
              Save Draft
            </button>
            <button type="button" disabled={saving} onClick={() => saveCurrent('published')}
              style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0.45rem 1.1rem', borderRadius: 'var(--r-full)', background: 'linear-gradient(135deg,#1563B2,#14B8A6)', color: 'white', border: 'none', cursor: 'pointer' }}>
              Publish
            </button>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.75rem', marginBottom: '1rem', boxShadow: 'var(--s1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Article Title *</label>
              <input value={current.title} onChange={(event) => setCurrent((article) => ({ ...article, title: event.target.value, slug: article.slug || toSlug(event.target.value) }))}
                placeholder="Enter a compelling title..."
                style={{ ...inputStyle, fontSize: '1.05rem', fontFamily: "'Cormorant Garamond',serif" }} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input value={current.slug || ''} onChange={(event) => setCurrent((article) => ({ ...article, slug: toSlug(event.target.value) }))}
                placeholder="auto-generated-from-title"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input value={current.cat || current.category || ''} onChange={(event) => setCurrent((article) => ({ ...article, cat: event.target.value, category: event.target.value }))}
                placeholder="e.g. Internet Governance"
                style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Tags</label>
              <input value={(current.tags || []).join(', ')} onChange={(event) => setCurrent((article) => ({ ...article, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) }))}
                placeholder="AI Governance, Digital Rights"
                style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Excerpt / Summary</label>
              <textarea value={current.excerpt || ''} onChange={(event) => setCurrent((article) => ({ ...article, excerpt: event.target.value }))}
                placeholder="One or two sentences summarising the article..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>SEO Description</label>
              <textarea value={current.seo?.metaDescription || ''} onChange={(event) => setCurrent((article) => ({ ...article, seo: { ...article.seo, metaDescription: event.target.value } }))}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Cover Image URL or Upload</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {coverPreview || current.coverImage ? (
                <img src={coverPreview || current.coverImage} alt="Cover" style={{ width: 120, height: 72, objectFit: 'cover', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }} />
              ) : null}
              <input
                value={current.coverImage || ''}
                onChange={(event) => { setCoverPreview(event.target.value); setCurrent((article) => ({ ...article, coverImage: event.target.value })); }}
                placeholder="https://..."
                style={inputStyle}
              />
              <button type="button" onClick={() => coverInputRef.current?.click()}
                style={{ flexShrink: 0, padding: '0.55rem 0.9rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                Upload
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(event) => handleCoverFile(event.target.files[0])} />
            </div>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--s1)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            padding: '0.6rem 0.75rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-sky-light)',
          }}>
            {TOOLBAR.map((button, index) => button.sep ? (
              <div key={index} style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
            ) : (
              <button
                key={(button.action || button.cmd) + (button.arg || '')}
                type="button"
                title={button.title}
                onMouseDown={(event) => {
                  event.preventDefault();
                  runToolbarAction(button);
                }}
                style={{
                  minWidth: button.icon.length > 2 ? 46 : 30,
                  height: 30,
                  padding: '0 6px',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid transparent',
                  background: 'transparent',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-mid)',
                  cursor: 'pointer',
                }}
              >
                {button.icon}
              </button>
            ))}
            {CALLOUT_TYPES.map((callout) => (
              <button
                key={callout.type}
                type="button"
                title={`Insert ${callout.label} callout`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  insertCallout(callout.type);
                }}
                style={{ padding: '0 8px', height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'rgba(59,154,232,0.08)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky-700)', cursor: 'pointer' }}
              >
                {callout.label}
              </button>
            ))}
            <input
              ref={bodyImageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(event) => {
                handleBodyImageFile(event.target.files[0]);
                event.target.value = '';
              }}
            />
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="article-rich-editor"
            suppressContentEditableWarning
            onInput={syncEditorBody}
            onPaste={handleEditorPaste}
            onKeyDown={handleEditorKeyDown}
            style={{
              minHeight: 480,
              padding: '2rem 2.5rem',
              border: 'none',
              borderRadius: 0,
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.88,
              color: 'var(--text-body)',
            }}
          />

          <div style={{ padding: '0.6rem 1.2rem', borderTop: '1px solid var(--border)', background: 'var(--bg-sky-light)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {wordCount(current.body)} words · {readingTime(current.body)} min read
            </span>
            <span style={{ fontSize: '0.76rem', color: current.status === 'published' ? 'var(--mint-600)' : 'var(--text-muted)', fontWeight: 600 }}>
              {saving ? 'Saving...' : current.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {linkModal.open ? (
          <div className="article-link-modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLinkModal();
          }}>
            <form className="article-link-modal" onSubmit={applyLink}>
              <div>
                <h3>{linkModal.isEditing ? 'Edit link' : 'Add link'}</h3>
                <p>Use HTTPS for external links, or start internal links with /.</p>
              </div>
              <label>
                Link URL
                <input
                  autoFocus
                  value={linkModal.url}
                  onChange={(event) => setLinkModal((modal) => ({ ...modal, url: event.target.value, error: '' }))}
                  placeholder="https://example.com or /articles"
                />
              </label>
              <label>
                Link text
                <input
                  value={linkModal.text}
                  onChange={(event) => setLinkModal((modal) => ({ ...modal, text: event.target.value }))}
                  placeholder="Selected text"
                />
              </label>
              {linkModal.error ? <p className="article-link-modal-error">{linkModal.error}</p> : null}
              <div className="article-link-modal-actions">
                {linkModal.isEditing ? (
                  <button type="button" className="article-link-remove" onClick={removeLinkFromEditor}>
                    Remove link
                  </button>
                ) : null}
                <span />
                <button type="button" onClick={closeLinkModal}>Cancel</button>
                <button type="submit" className="article-link-apply">
                  {linkModal.isEditing ? 'Update link' : 'Add link'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
