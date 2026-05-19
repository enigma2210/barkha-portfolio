import { useEffect, useRef, useState } from 'react';
import { ARTS } from '../../data/articles';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { toSlug } from '../../utils/urlRouter';

const STORAGE_KEY = 'barkha_user_articles_v1';

export function getUserArticles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUserArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

const TOOLBAR = [
  { cmd: 'bold', icon: 'B', title: 'Bold', style: 'font-weight:700' },
  { cmd: 'italic', icon: 'I', title: 'Italic', style: 'font-style:italic' },
  { cmd: 'underline', icon: 'U', title: 'Underline', style: 'text-decoration:underline' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h2', icon: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', arg: 'h3', icon: 'H3', title: 'Heading 3' },
  { cmd: 'formatBlock', arg: 'p', icon: 'P', title: 'Paragraph' },
  { sep: true },
  {
    cmd: 'blockquote',
    icon: '❝',
    title: 'Callout block',
    custom: () => document.execCommand('formatBlock', false, 'blockquote'),
  },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: '• —', title: 'Bullet List' },
  { cmd: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
  { sep: true },
  {
    cmd: 'createLink',
    icon: '🔗',
    title: 'Insert Link',
    custom: () => {
      const url = window.prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
    },
  },
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
  transition: 'border-color 0.18s, box-shadow 0.18s',
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

function slugify(value) {
  return toSlug(value);
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function createBlankArticle() {
  return {
    id: `article-${Date.now()}`,
    cat: '',
    title: '',
    date: '',
    dateRaw: '',
    excerpt: '',
    body: '<p><br></p>',
    status: 'draft',
    coverImage: null,
    coverFit: 'cover',
    createdAt: Date.now(),
  };
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

function uniqueSlug(base, articles, previousId) {
  const fallback = `article-${Date.now()}`;
  const cleanBase = slugify(base) || fallback;
  let candidate = cleanBase;
  let suffix = 2;
  const staticSlugs = Object.entries(ARTS).flatMap(([key, article]) => [key, toSlug(article.title)]);
  const taken = new Set([
    ...staticSlugs,
    ...articles
      .filter((article) => article.id !== previousId && article.slug !== previousId)
      .flatMap((article) => [article.id, article.slug].filter(Boolean)),
  ]);

  while (taken.has(candidate)) {
    candidate = `${cleanBase}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function ArticleEditor({ showToast }) {
  const [mode, setMode] = useState('list');
  const [articles, setArticles] = useState(getUserArticles);
  const [current, setCurrent] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [lastPublishedUrl, setLastPublishedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const editorRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (mode === 'edit' && editorRef.current && current) {
      editorRef.current.innerHTML = current.body || '<p><br></p>';
    }
  }, [mode, current?.id]);

  function syncEditorBody() {
    const body = sanitizeHtml(editorRef.current?.innerHTML || '<p><br></p>');
    setCurrent((article) => (article ? { ...article, body } : article));
  }

  function insertHtmlAtSelection(html) {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const cleaned = sanitizeHtml(html);

    if (document.queryCommandSupported?.('insertHTML')) {
      document.execCommand('insertHTML', false, cleaned);
      syncEditorBody();
      return;
    }

    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      editor.insertAdjacentHTML('beforeend', cleaned);
      syncEditorBody();
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      editor.insertAdjacentHTML('beforeend', cleaned);
      syncEditorBody();
      return;
    }

    range.deleteContents();
    const template = document.createElement('template');
    template.innerHTML = cleaned;
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    syncEditorBody();
  }

  function insertCallout() {
    insertHtmlAtSelection(
      '<div class="art-callout"><p><strong>Key point:</strong> Add your callout text here.</p></div><p><br></p>',
    );
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
      setCurrent((article) => ({ ...article, coverImage: event.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function saveArticle(status) {
    const all = getUserArticles();
    const previousId = current.id;
    const body = sanitizeHtml(editorRef.current?.innerHTML || current.body || '<p><br></p>');
    const slug = uniqueSlug(current.slug || current.title || previousId, all, previousId);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const updated = {
      ...current,
      id: slug,
      slug,
      body,
      status,
      date: current.date || today,
      excerpt: current.excerpt || excerptFromBody(body),
      createdAt: current.createdAt || Date.now(),
    };
    const next = [updated, ...all.filter((article) => article.id !== previousId && article.id !== slug && article.slug !== slug)];
    saveUserArticles(next);
    setArticles(next);
    setCurrent(updated);
    showToast?.(status === 'published' ? '✓ Article published!' : '✓ Draft saved.');
    if (status === 'published') {
      setLastPublishedUrl(`${window.location.origin}/articles/${slug}`);
      setCopiedUrl(false);
      setMode('list');
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

  function deleteArticle(id) {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    const updated = getUserArticles().filter((article) => article.id !== id);
    saveUserArticles(updated);
    setArticles(updated);
    showToast?.('Article deleted.');
  }

  if (mode === 'list') {
    const sorted = [...articles].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--sky-900)', margin: 0 }}>
              Articles
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {articles.length} total · {articles.filter((article) => article.status === 'published').length} published · {articles.filter((article) => article.status === 'draft').length} drafts
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setCurrent(createBlankArticle()); setMode('edit'); setCoverPreview(null); }}
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

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>✍️</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem' }}>No articles yet</p>
            <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>Click "New Article" to start writing</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sorted.map((article) => (
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
                  transition: 'box-shadow 0.2s',
                }}
              >
                {article.coverImage ? (
                  <img src={article.coverImage} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--r-sm)', background: 'var(--bg-sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📄</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>
                    {article.cat || 'Uncategorised'}
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {article.title || 'Untitled'}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {article.date || 'No date'} · {article.status === 'published' ? '🟢 Published' : '🟡 Draft'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button type="button" onClick={() => { setCurrent(article); setMode('edit'); setCoverPreview(article.coverImage); }}
                    style={{ fontSize: '0.76rem', fontWeight: 600, padding: '0.32rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-sky-light)', border: '1px solid var(--border)', color: 'var(--sky-700)', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => { setCurrent(article); setMode('preview'); }}
                    style={{ fontSize: '0.76rem', fontWeight: 600, padding: '0.32rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: 'var(--teal-600)', cursor: 'pointer' }}>
                    Preview
                  </button>
                  <button type="button" onClick={() => deleteArticle(article.id)}
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
            ← Back to Articles
          </button>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="button" onClick={() => saveArticle('draft')}
              style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0.45rem 1.1rem', borderRadius: 'var(--r-full)', background: 'var(--bg-sky-light)', border: '1px solid var(--border)', color: 'var(--sky-700)', cursor: 'pointer' }}>
              Save Draft
            </button>
            <button type="button" onClick={() => saveArticle('published')}
              style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0.45rem 1.1rem', borderRadius: 'var(--r-full)', background: 'linear-gradient(135deg,#1563B2,#14B8A6)', color: 'white', border: 'none', cursor: 'pointer' }}>
              Publish
            </button>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.75rem', marginBottom: '1rem', boxShadow: 'var(--s1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Article Title *</label>
              <input value={current.title} onChange={(event) => setCurrent((article) => ({ ...article, title: event.target.value }))}
                placeholder="Enter a compelling title..."
                style={{ ...inputStyle, fontSize: '1.05rem', fontFamily: "'Cormorant Garamond',serif" }} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input value={current.cat} onChange={(event) => setCurrent((article) => ({ ...article, cat: event.target.value }))}
                placeholder="e.g. Internet Governance"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Publication Date</label>
              <input type="date" value={current.dateRaw || ''}
                onChange={(event) => {
                  const date = event.target.value ? new Date(event.target.value) : null;
                  const formatted = date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                  setCurrent((article) => ({ ...article, dateRaw: event.target.value, date: formatted }));
                }}
                style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Excerpt / Summary <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>— shown on blog card</span></label>
              <textarea value={current.excerpt} onChange={(event) => setCurrent((article) => ({ ...article, excerpt: event.target.value }))}
                placeholder="One or two sentences summarising the article..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Cover Image <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>— optional, shown in article header</span></label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {coverPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={coverPreview} alt="Cover" style={{ width: 120, height: 72, objectFit: 'cover', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }} />
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem' }}>
                    {['cover', 'contain', 'fill'].map((fit) => (
                      <button key={fit} type="button" onClick={() => setCurrent((article) => ({ ...article, coverFit: fit }))}
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--r-sm)',
                          fontWeight: 600,
                          background: current.coverFit === fit ? 'var(--sky-600)' : 'var(--bg-sky-light)',
                          color: current.coverFit === fit ? 'white' : 'var(--sky-700)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                        }}>
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div
                onClick={() => coverInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); handleCoverFile(event.dataTransfer.files[0]); }}
                style={{
                  flex: 1,
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <p style={{ fontSize: '0.84rem', color: 'var(--text-mid)', margin: 0 }}>
                  <strong style={{ color: 'var(--sky-600)' }}>Click to upload</strong> or drag & drop
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  JPG, PNG, WEBP — recommended 1200×630px
                </p>
              </div>
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
                key={index}
                type="button"
                title={button.title}
                onMouseDown={(event) => {
                  event.preventDefault();
                  editorRef.current?.focus();
                  if (button.custom) button.custom(editorRef);
                  else if (button.arg) document.execCommand(button.cmd, false, button.arg);
                  else document.execCommand(button.cmd);
                  syncEditorBody();
                }}
                style={{
                  minWidth: 30,
                  height: 30,
                  padding: '0 6px',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid transparent',
                  background: 'transparent',
                  fontSize: button.icon.length > 2 ? '0.72rem' : '0.84rem',
                  fontWeight: 700,
                  color: 'var(--text-mid)',
                  cursor: 'pointer',
                  fontStyle: button.cmd === 'italic' ? 'italic' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                {button.icon}
              </button>
            ))}
            <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
            <button
              type="button"
              title="Insert Callout Box"
              onMouseDown={(event) => {
                event.preventDefault();
                insertCallout();
              }}
              style={{ padding: '0 8px', height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'rgba(59,154,232,0.08)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky-700)', cursor: 'pointer' }}
            >
              + Callout
            </button>
            <button
              type="button"
              title="Insert Image in Body"
              onMouseDown={(event) => {
                event.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = () => {
                  const file = input.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (readerEvent) => {
                    editorRef.current?.focus();
                    insertHtmlAtSelection(
                      `<figure style="margin:1.5rem 0;text-align:center;">
                        <img src="${readerEvent.target.result}" style="max-width:100%;height:auto;border-radius:var(--r-md);box-shadow:var(--s2);object-fit:${current.coverFit || 'cover'}" alt="" />
                        <figcaption style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;font-style:italic;">Caption (click to edit)</figcaption>
                      </figure><p><br></p>`);
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              style={{ padding: '0 8px', height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'rgba(20,184,166,0.08)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal-600)', cursor: 'pointer' }}
            >
              + Image
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncEditorBody}
            style={{
              minHeight: 480,
              padding: '2rem 2.5rem',
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
              {current.status === 'published' ? '🟢 Published' : '🟡 Draft'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'preview' && current) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => setMode('edit')}
            style={{ fontSize: '0.82rem', color: 'var(--sky-600)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            ← Back to Editor
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Preview — as it appears on site</span>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--r-lg)', boxShadow: 'var(--s2)', overflow: 'hidden', maxWidth: 800, margin: '0 auto' }}>
          {current.coverImage ? (
            <img src={current.coverImage} alt="" style={{ width: '100%', height: 280, objectFit: current.coverFit || 'cover' }} />
          ) : null}
          <div style={{ padding: '2.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal-600)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>{current.cat}</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'var(--text-navy)', margin: '0.6rem 0 1rem', lineHeight: 1.2 }}>
              {current.title}
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {current.date} · {readingTime(current.body)} min read
            </p>
            <div className="art-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.body) }} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export { STORAGE_KEY as USER_ARTICLES_STORAGE_KEY };
