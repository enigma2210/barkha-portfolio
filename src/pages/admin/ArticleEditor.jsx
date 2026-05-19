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
  { cmd: 'bold', icon: 'B', title: 'Bold' },
  { cmd: 'italic', icon: 'I', title: 'Italic' },
  { cmd: 'underline', icon: 'U', title: 'Underline' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h2', icon: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', arg: 'h3', icon: 'H3', title: 'Heading 3' },
  { cmd: 'formatBlock', arg: 'p', icon: 'P', title: 'Paragraph' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: 'List', title: 'Bullet List' },
  { cmd: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
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
  const editorRef = useRef(null);
  const coverInputRef = useRef(null);

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

  function syncEditorBody() {
    const body = sanitizeHtml(editorRef.current?.innerHTML || '<p><br></p>');
    setCurrent((article) => (article ? { ...article, body } : article));
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
                key={button.cmd + (button.arg || '')}
                type="button"
                title={button.title}
                onMouseDown={(event) => {
                  event.preventDefault();
                  editorRef.current?.focus();
                  if (button.arg) document.execCommand(button.cmd, false, button.arg);
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
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-mid)',
                  cursor: 'pointer',
                }}
              >
                {button.icon}
              </button>
            ))}
            <button
              type="button"
              title="Insert Callout Box"
              onMouseDown={(event) => {
                event.preventDefault();
                insertHtmlAtSelection('<div class="art-callout"><p><strong>Key point:</strong> Add your callout text here.</p></div><p><br></p>');
              }}
              style={{ padding: '0 8px', height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'rgba(59,154,232,0.08)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky-700)', cursor: 'pointer' }}
            >
              + Callout
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
              {saving ? 'Saving...' : current.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
