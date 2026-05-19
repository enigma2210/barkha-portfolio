import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  buildExcerpt,
  deleteArticle,
  estimateReadingTime,
  getEditableArticles,
  saveArticle,
} from '../../data/articleStore';
import { PERSON } from '../../data/siteData';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

const EMPTY_ARTICLE = {
  id: '',
  title: '',
  subtitle: '',
  slug: '',
  category: 'Internet Governance',
  tags: [],
  featuredImage: '',
  authorName: PERSON.nameEn,
  publishDate: new Date().toISOString().slice(0, 10),
  readingTime: 1,
  body: '<p>Start writing here...</p>',
  status: 'draft',
  seo: {
    metaTitle: '',
    metaDescription: '',
    openGraphImage: '',
    canonicalUrl: '',
  },
};

const CATEGORIES = [
  'Internet Governance',
  'Digital Policy',
  'Cybersecurity',
  'AI Governance',
  'Digital Rights',
  'Community',
];

const TOOLBAR_GROUPS = [
  [
    ['bold', 'B', 'Bold'],
    ['italic', 'I', 'Italic'],
    ['underline', 'U', 'Underline'],
  ],
  [
    ['formatBlock:h1', 'H1', 'Heading 1'],
    ['formatBlock:h2', 'H2', 'Heading 2'],
    ['formatBlock:h3', 'H3', 'Heading 3'],
  ],
  [
    ['insertUnorderedList', '• List', 'Bullet list'],
    ['insertOrderedList', '1. List', 'Numbered list'],
    ['formatBlock:blockquote', 'Quote', 'Quote'],
    ['formatBlock:pre', 'Code', 'Inline code block'],
  ],
  [
    ['justifyLeft', 'Left', 'Align left'],
    ['justifyCenter', 'Center', 'Align center'],
    ['justifyRight', 'Right', 'Align right'],
  ],
  [
    ['undo', 'Undo', 'Undo'],
    ['redo', 'Redo', 'Redo'],
  ],
];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function textFromHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function markdownToHtml(source) {
  const lines = String(source || '').split(/\r?\n/);
  let inList = false;
  let ordered = false;

  const closeList = () => {
    if (!inList) return '';
    const tag = ordered ? 'ol' : 'ul';
    inList = false;
    ordered = false;
    return `</${tag}>`;
  };

  const inline = (line) => line
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return sanitizeHtml(lines.map((line) => {
    if (/^###\s+/.test(line)) return `${closeList()}<h3>${inline(line.replace(/^###\s+/, ''))}</h3>`;
    if (/^##\s+/.test(line)) return `${closeList()}<h2>${inline(line.replace(/^##\s+/, ''))}</h2>`;
    if (/^#\s+/.test(line)) return `${closeList()}<h1>${inline(line.replace(/^#\s+/, ''))}</h1>`;
    if (/^>\s+/.test(line)) return `${closeList()}<blockquote>${inline(line.replace(/^>\s+/, ''))}</blockquote>`;
    if (/^[-*]\s+/.test(line)) {
      const prefix = inList && !ordered ? '' : `${closeList()}<ul>`;
      inList = true;
      ordered = false;
      return `${prefix}<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`;
    }
    if (/^\d+\.\s+/.test(line)) {
      const prefix = inList && ordered ? '' : `${closeList()}<ol>`;
      inList = true;
      ordered = true;
      return `${prefix}<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`;
    }
    if (!line.trim()) return closeList();
    return `${closeList()}<p>${inline(line)}</p>`;
  }).join('') + closeList());
}

function createFigure(src, caption = 'Image caption') {
  const id = `img-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  return `
    <figure class="article-image" data-image-id="${id}" style="width:100%">
      <img src="${src}" alt="${caption}" style="width:100%;height:auto;object-fit:cover" />
      <figcaption>${caption}</figcaption>
    </figure>
  `;
}

export function ArticleEditor({ showToast }) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const sideBySideInputRef = useRef(null);
  const featuredInputRef = useRef(null);
  const autosaveRef = useRef(null);
  const [articles, setArticles] = useState(() => getEditableArticles());
  const [article, setArticle] = useState(EMPTY_ARTICLE);
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(EMPTY_ARTICLE.body);
  const [editorVersion, setEditorVersion] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState('');
  const [selectedImageWidth, setSelectedImageWidth] = useState(100);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [autosaveStatus, setAutosaveStatus] = useState('Idle');

  const bodyText = useMemo(() => textFromHtml(article.body), [article.body]);
  const characterCount = bodyText.length;
  const readingTime = estimateReadingTime(article.body);

  const updateArticle = (patch) => {
    setArticle((current) => {
      const next = { ...current, ...patch };
      if (patch.title && !current.slug) next.slug = slugify(patch.title);
      next.readingTime = estimateReadingTime(next.body);
      next.excerpt = buildExcerpt(next.body, next.subtitle);
      return next;
    });
    setAutosaveStatus('Unsaved');
  };

  useEffect(() => {
    if (!sourceMode && editorRef.current && editorRef.current.innerHTML !== article.body) {
      editorRef.current.innerHTML = article.body;
    }
  }, [article.body, editorVersion, sourceMode]);

  useEffect(() => {
    if (sourceMode || article.status === 'published' || !article.title.trim()) return undefined;
    window.clearTimeout(autosaveRef.current);
    autosaveRef.current = window.setTimeout(() => {
      setAutosaveStatus('Saving...');
      const saved = saveArticle(article, 'draft');
      setArticle(saved);
      setArticles(getEditableArticles());
      setAutosaveStatus('Draft autosaved');
    }, 1400);
    return () => window.clearTimeout(autosaveRef.current);
  }, [article, sourceMode]);

  const runCommand = (command) => {
    editorRef.current?.focus();
    if (command.startsWith('formatBlock:')) {
      document.execCommand('formatBlock', false, command.split(':')[1]);
    } else {
      document.execCommand(command, false);
    }
    updateArticle({ body: sanitizeHtml(editorRef.current?.innerHTML || '') });
  };

  const addLink = () => {
    const href = window.prompt('Paste a URL');
    if (!href) return;
    editorRef.current?.focus();
    document.execCommand('createLink', false, href);
    updateArticle({ body: sanitizeHtml(editorRef.current?.innerHTML || '') });
  };

  const insertHtml = (html) => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, sanitizeHtml(html));
    updateArticle({ body: sanitizeHtml(editorRef.current?.innerHTML || '') });
  };

  const handleBodyInput = () => {
    updateArticle({ body: sanitizeHtml(editorRef.current?.innerHTML || '') });
  };

  const readImageFiles = (files, callback) => {
    Array.from(files || [])
      .filter((file) => file.type.startsWith('image/'))
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => callback(event.target.result, file.name);
        reader.readAsDataURL(file);
      });
  };

  const insertImages = (files) => {
    readImageFiles(files, (src, name) => insertHtml(createFigure(src, name.replace(/\.[^.]+$/, ''))));
  };

  const insertSideBySideImages = (files) => {
    const images = [];
    readImageFiles(files, (src, name) => {
      images.push(createFigure(src, name.replace(/\.[^.]+$/, '')));
      if (images.length === Math.min(files.length, 2)) {
        insertHtml(`<div class="article-image-grid">${images.slice(0, 2).join('')}</div>`);
      }
    });
  };

  const uploadFeaturedImage = (files) => {
    readImageFiles(files, (src) => {
      updateArticle({
        featuredImage: src,
        seo: { ...article.seo, openGraphImage: article.seo.openGraphImage || src },
      });
    });
  };

  const selectImage = (event) => {
    const figure = event.target.closest?.('figure.article-image');
    if (!figure) return;
    const id = figure.dataset.imageId;
    setSelectedImageId(id);
    setSelectedImageWidth(parseInt(figure.style.width || '100', 10));
    setSelectedCaption(figure.querySelector('figcaption')?.textContent || '');
  };

  const selectedFigure = () => (
    selectedImageId ? editorRef.current?.querySelector(`[data-image-id="${selectedImageId}"]`) : null
  );

  const updateSelectedImage = (patch) => {
    const figure = selectedFigure();
    if (!figure) return;
    if (patch.width) figure.style.width = `${patch.width}%`;
    if (patch.caption !== undefined) {
      let caption = figure.querySelector('figcaption');
      if (!caption) {
        caption = document.createElement('figcaption');
        figure.appendChild(caption);
      }
      caption.textContent = patch.caption;
    }
    if (patch.crop !== undefined) {
      const img = figure.querySelector('img');
      if (img) {
        img.style.height = patch.crop ? '260px' : 'auto';
        img.style.objectFit = patch.crop ? 'cover' : 'contain';
      }
    }
    updateArticle({ body: sanitizeHtml(editorRef.current?.innerHTML || '') });
  };

  const loadArticle = (item) => {
    setArticle(item);
    setSourceValue(item.body);
    setSourceMode(false);
    setSelectedImageId('');
    setEditorVersion((value) => value + 1);
    setAutosaveStatus(item.status === 'published' ? 'Published' : 'Draft loaded');
  };

  const newArticle = () => {
    setArticle({ ...EMPTY_ARTICLE, publishDate: new Date().toISOString().slice(0, 10) });
    setSourceValue(EMPTY_ARTICLE.body);
    setSourceMode(false);
    setSelectedImageId('');
    setEditorVersion((value) => value + 1);
    setAutosaveStatus('New draft');
  };

  const persist = (status, message) => {
    const saved = saveArticle({
      ...article,
      id: article.id || article.slug || slugify(article.title),
      slug: article.slug || slugify(article.title),
      publishDate: article.publishDate || new Date().toISOString().slice(0, 10),
      readingTime,
    }, status);
    setArticle(saved);
    setArticles(getEditableArticles());
    setAutosaveStatus(status === 'published' ? 'Published' : 'Draft saved');
    showToast?.(message);
  };

  const removeArticle = () => {
    if (!article.id || !window.confirm('Delete this article?')) return;
    deleteArticle(article.id);
    setArticles(getEditableArticles());
    newArticle();
    showToast?.('Article deleted.');
  };

  const applySource = () => {
    const html = /<\/?[a-z][\s\S]*>/i.test(sourceValue) ? sourceValue : markdownToHtml(sourceValue);
    const cleaned = sanitizeHtml(html);
    updateArticle({ body: cleaned });
    setSourceMode(false);
    setEditorVersion((value) => value + 1);
  };

  return (
    <div className="article-editor-shell">
      <aside className="article-editor-library">
        <div className="article-editor-library-head">
          <h3>Articles</h3>
          <button type="button" onClick={newArticle}>New</button>
        </div>
        {articles.length ? articles.map((item) => (
          <button
            type="button"
            className={article.id === item.id ? 'article-library-item is-active' : 'article-library-item'}
            key={item.id}
            onClick={() => loadArticle(item)}
          >
            <strong>{item.title}</strong>
            <span>{item.status} · {item.category || item.cat}</span>
          </button>
        )) : <p className="admin-muted">No saved articles yet.</p>}
      </aside>

      <section className="article-editor-workspace">
        <div className="article-editor-meta-card">
          <div className="article-editor-meta-grid">
            <label>
              Title
              <input value={article.title} onChange={(event) => updateArticle({ title: event.target.value })} placeholder="Article title" />
            </label>
            <label>
              Subtitle
              <input value={article.subtitle} onChange={(event) => updateArticle({ subtitle: event.target.value })} placeholder="Short deck or subtitle" />
            </label>
            <label>
              Slug
              <input value={article.slug} onChange={(event) => updateArticle({ slug: slugify(event.target.value) })} placeholder="article-slug" />
            </label>
            <label>
              Category
              <select value={article.category} onChange={(event) => updateArticle({ category: event.target.value, cat: event.target.value })}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Tags
              <input
                value={(article.tags || []).join(', ')}
                onChange={(event) => updateArticle({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })}
                placeholder="DNS, ICANN, policy"
              />
            </label>
            <label>
              Author name
              <input value={article.authorName} onChange={(event) => updateArticle({ authorName: event.target.value })} />
            </label>
            <label>
              Publish date
              <input type="date" value={article.publishDate?.slice(0, 10) || ''} onChange={(event) => updateArticle({ publishDate: event.target.value, date: event.target.value })} />
            </label>
            <label>
              Reading time
              <input value={`${readingTime} min read`} readOnly />
            </label>
          </div>

          <div className="article-seo-grid">
            <label>
              Meta title
              <input value={article.seo.metaTitle} onChange={(event) => updateArticle({ seo: { ...article.seo, metaTitle: event.target.value } })} />
            </label>
            <label>
              Meta description
              <input value={article.seo.metaDescription} onChange={(event) => updateArticle({ seo: { ...article.seo, metaDescription: event.target.value } })} />
            </label>
            <label>
              OpenGraph image
              <input value={article.seo.openGraphImage} onChange={(event) => updateArticle({ seo: { ...article.seo, openGraphImage: event.target.value } })} />
            </label>
            <label>
              Canonical URL
              <input value={article.seo.canonicalUrl} onChange={(event) => updateArticle({ seo: { ...article.seo, canonicalUrl: event.target.value } })} />
            </label>
          </div>

          <div className="article-featured-row">
            {article.featuredImage ? <img src={article.featuredImage} alt="" /> : <div>No featured image</div>}
            <button type="button" className="act-btn act-view" onClick={() => featuredInputRef.current?.click()}>
              Upload featured image
            </button>
            <input ref={featuredInputRef} type="file" accept="image/*" onChange={(event) => uploadFeaturedImage(event.target.files)} hidden />
          </div>
        </div>

        <div className="article-editor-split">
          <div className="article-editor-panel">
            <div className="article-editor-toolbar" role="toolbar" aria-label="Article formatting toolbar">
              {TOOLBAR_GROUPS.map((group) => (
                <div className="toolbar-group" key={group[0][0]}>
                  {group.map(([command, label, aria]) => (
                    <button type="button" key={command} aria-label={aria} onClick={() => runCommand(command)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}
              <div className="toolbar-group">
                <button type="button" onClick={addLink}>Link</button>
                <button type="button" onClick={() => imageInputRef.current?.click()}>Image</button>
                <button type="button" onClick={() => sideBySideInputRef.current?.click()}>Side-by-side</button>
                <button type="button" onClick={() => {
                  setSourceValue(article.body);
                  setSourceMode((value) => !value);
                }}>
                  HTML/Markdown
                </button>
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => insertImages(event.target.files)} />
              <input ref={sideBySideInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => insertSideBySideImages(event.target.files)} />
            </div>

            {selectedImageId ? (
              <div className="article-image-controls">
                <label>
                  Image width
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={selectedImageWidth}
                    onChange={(event) => {
                      const width = Number(event.target.value);
                      setSelectedImageWidth(width);
                      updateSelectedImage({ width });
                    }}
                  />
                </label>
                <label>
                  Caption
                  <input
                    value={selectedCaption}
                    onChange={(event) => {
                      setSelectedCaption(event.target.value);
                      updateSelectedImage({ caption: event.target.value });
                    }}
                  />
                </label>
                <button type="button" onClick={() => updateSelectedImage({ width: 100 })}>Fit width</button>
                <button type="button" onClick={() => updateSelectedImage({ crop: true })}>Crop</button>
                <button type="button" onClick={() => updateSelectedImage({ crop: false })}>Uncrop</button>
              </div>
            ) : null}

            <div
              className="article-editor-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                insertImages(event.dataTransfer.files);
              }}
            >
              {sourceMode ? (
                <div className="article-source-editor">
                  <textarea value={sourceValue} onChange={(event) => setSourceValue(event.target.value)} aria-label="Article HTML or Markdown source" />
                  <button type="button" className="btn btn-outline" onClick={applySource}>Apply source</button>
                </div>
              ) : (
                <div
                  ref={editorRef}
                  className="article-rich-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleBodyInput}
                  onClick={selectImage}
                  role="textbox"
                  aria-label="Article body editor"
                  tabIndex={0}
                />
              )}
            </div>

            <div className="article-editor-footer">
              <span>{autosaveStatus}</span>
              <span>{characterCount} characters · {readingTime} min read</span>
            </div>

            <div className="article-editor-actions">
              <button type="button" className="btn btn-outline" onClick={() => persist('draft', 'Draft saved.')}>Save Draft</button>
              <button type="button" className="btn btn-outline" onClick={() => setAutosaveStatus('Preview refreshed')}>Preview Article</button>
              <button type="button" className="btn btn-primary" onClick={() => persist('published', 'Article published.')}>Publish</button>
              <button type="button" className="btn btn-outline" onClick={() => persist(article.status || 'draft', 'Article updated.')}>Update Existing Article</button>
              <button type="button" className="act-btn act-delete" onClick={removeArticle}>Delete Article</button>
            </div>
          </div>

          <motion.article
            className="article-preview-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="article-hero article-preview-hero">
              <div className="article-inner">
                <div className="art-cat">{article.category}</div>
                <h1 className="art-title">{article.title || 'Untitled Article'}</h1>
                {article.subtitle ? <p className="art-subtitle">{article.subtitle}</p> : null}
                <p className="admin-muted">{article.authorName} · {article.publishDate} · {readingTime} min read</p>
              </div>
            </div>
            {article.featuredImage ? <img className="article-preview-featured" src={article.featuredImage} alt="" /> : null}
            <div className="art-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }} />
          </motion.article>
        </div>
      </section>
    </div>
  );
}
