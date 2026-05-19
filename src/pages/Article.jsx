import { useEffect, useMemo, useRef, useState } from 'react';
import { getArticleById } from '../data/articleStore';
import { addComment, getComments } from '../data/comments';
import { AuthorAvatar } from '../components/ui/AuthorAvatar';
import { ReadingProgress } from '../components/ui/ReadingProgress';
import { PERSON } from '../data/siteData';
import { getProfile, PROFILE_KEY } from '../utils/profileStorage';

function validateCommentForm(name, email, text) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
  if (!text.trim()) errors.text = 'Comment cannot be empty';
  else if (text.trim().length < 10) errors.text = 'Comment must be at least 10 characters';
  return errors;
}

function CommenterAvatar({ name, size = 38 }) {
  const initial = (name || 'A')[0].toUpperCase();
  const colors = [
    'linear-gradient(135deg, var(--sky-400), var(--sky-600))',
    'linear-gradient(135deg, var(--teal-500), var(--teal-600))',
    'linear-gradient(135deg, var(--mint-600), var(--mint-600))',
    'linear-gradient(135deg, var(--gold), var(--gold))',
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: colors[colorIndex],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: size * 0.4,
        fontFamily: "'Inter', sans-serif",
        flexShrink: 0,
      }}
      aria-label={`${name || 'Commenter'} avatar`}
    >
      {initial}
    </div>
  );
}

function CommentForm({ articleId, onSubmitted, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', text: '' });
  const [errors, setErrors] = useState({});
  const [commentConsent, setCommentConsent] = useState(false);
  const [commentConsentError, setCommentConsentError] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();
    const validationErrors = validateCommentForm(form.name, form.email, form.text);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!commentConsent) {
      setCommentConsentError(true);
      return;
    }

    setCommentConsentError(false);

    const next = {
      id: `c${Date.now()}`,
      articleId,
      name: form.name.trim(),
      email: form.email.trim(),
      text: form.text.trim(),
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'pending',
    };

    const comments = addComment(next);
    onSubmitted(comments);
    setForm({ name: '', email: '', text: '' });
    setErrors({});
    setCommentConsent(false);
    showToast?.('\u2726 Your insight has been sent for professional moderation.');
  };

  return (
    <form className="comment-form-box" onSubmit={submit} noValidate>
      <h3>Leave a Thought</h3>
      <div className="form-2col">
        <div className="form-field">
          <label htmlFor="comment-name">Name</label>
          <input
            id="comment-name"
            className={errors.name ? 'form-input is-invalid' : 'form-input'}
            value={form.name}
            onChange={update('name')}
            placeholder="Full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'comment-name-error' : undefined}
          />
          {errors.name ? <span className="field-error" id="comment-name-error">{errors.name}</span> : null}
        </div>
        <div className="form-field">
          <label htmlFor="comment-email">Email</label>
          <input
            id="comment-email"
            type="email"
            className={errors.email ? 'form-input is-invalid' : 'form-input'}
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'comment-email-error' : undefined}
          />
          {errors.email ? <span className="field-error" id="comment-email-error">{errors.email}</span> : null}
        </div>
      </div>
      <div className="form-field u-mb-12">
        <label htmlFor="comment-text">Thought</label>
        <textarea
          id="comment-text"
          className={errors.text ? 'form-input is-invalid' : 'form-input'}
          value={form.text}
          onChange={update('text')}
          placeholder="Share your perspective..."
          aria-invalid={Boolean(errors.text)}
          aria-describedby={errors.text ? 'comment-text-error' : undefined}
        />
        {errors.text ? <span className="field-error" id="comment-text-error">{errors.text}</span> : null}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem',
          background: commentConsentError ? 'rgba(239,68,68,0.04)' : 'rgba(20,184,166,0.04)',
          border: `1px solid ${commentConsentError ? 'rgba(239,68,68,0.25)' : 'rgba(20,184,166,0.18)'}`,
          borderRadius: 'var(--r-md)',
          marginTop: '0.5rem',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <div style={{ flexShrink: 0, marginTop: '1px' }}>
          <input
            type="checkbox"
            id="comment-consent"
            checked={commentConsent}
            onChange={(event) => {
              setCommentConsent(event.target.checked);
              if (event.target.checked) setCommentConsentError(false);
            }}
            style={{
              width: 17,
              height: 17,
              cursor: 'pointer',
              accentColor: 'var(--teal-500)',
            }}
          />
        </div>
        <label
          htmlFor="comment-consent"
          style={{
            fontSize: '0.8rem',
            lineHeight: 1.55,
            color: commentConsentError ? '#B91C1C' : 'var(--text-mid)',
            cursor: 'pointer',
          }}
        >
          I consent to my <strong>name</strong> and <strong>email</strong> being shared with the site
          author for moderation purposes, in accordance with the DPDP Act, 2023.{' '}
          <span style={{ color: '#B91C1C', fontWeight: 700 }}>*</span>
        </label>
      </div>
      {commentConsentError ? (
        <p
          style={{
            fontSize: '0.78rem',
            color: '#B91C1C',
            marginTop: '0.4rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span>{'\u26A0'}</span> Please provide your consent before posting a comment.
        </p>
      ) : null}
      <button
        className="btn u-full-width"
        type="submit"
        style={{
          marginTop: '1rem',
          background: commentConsent
            ? 'linear-gradient(135deg, #1563B2, #14B8A6)'
            : 'rgba(0,0,0,0.18)',
          color: commentConsent ? 'white' : 'rgba(255,255,255,0.5)',
          border: 'none',
          cursor: commentConsent ? 'pointer' : 'not-allowed',
        }}
      >
        Submit for Moderation
      </button>
    </form>
  );
}

export function Article({ articleId, onBack, showToast }) {
  const article = getArticleById(articleId);
  const articleBodyRef = useRef(null);
  const [profile, setProfile] = useState(() => getProfile());
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(getComments());
  }, [articleId]);

  useEffect(() => {
    const previousTitle = document.title;
    const metaTitle = article.seo?.metaTitle || article.title;
    const metaDescription = article.seo?.metaDescription || article.excerpt || '';
    document.title = `${metaTitle} | Barkha Manral`;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', metaDescription);

    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  useEffect(() => {
    const syncProfile = () => setProfile(getProfile());
    const onStorage = (event) => {
      if (event.key === PROFILE_KEY) syncProfile();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('barkha-profile-updated', syncProfile);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('barkha-profile-updated', syncProfile);
    };
  }, []);

  const approved = useMemo(
    () => comments.filter((comment) => comment.articleId === article.id && comment.status === 'approved'),
    [article.id, comments],
  );

  return (
    <div className="article-page-wrap">
      <ReadingProgress articleRef={articleBodyRef} />

      <header className="article-hero">
        <div className="article-inner">
          <button className="back-btn" type="button" onClick={onBack}>
            {'\u2190'} Back to Archive
          </button>
          <div className="art-cat">{article.cat}</div>
          <h1 className="art-title">{article.title}</h1>
          {article.subtitle ? <p className="art-subtitle">{article.subtitle}</p> : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.2rem' }}>
            <AuthorAvatar size={42} />
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--sky-800)' }}>
                {PERSON.nameEn}
              </p>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {profile.title || PERSON.profileTitle} {'\u00B7'} {article.date}
              </p>
            </div>
          </div>
          {article.coverImage || article.featuredImage ? (
            <img
              src={article.coverImage || article.featuredImage}
              alt=""
              style={{
                width: '100%',
                maxHeight: 360,
                objectFit: article.coverFit || 'cover',
                borderRadius: 'var(--r-lg)',
                marginTop: '2rem',
                boxShadow: 'var(--s2)',
              }}
            />
          ) : null}
        </div>
      </header>

      <div className="art-body-wrap" ref={articleBodyRef}>
        <article className="art-body" dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>

      <section className="comments-wrap">
        <div className="section-eyebrow">Discussion</div>
        <h2 className="comments-heading section-h2">Community Reflections</h2>
        {approved.length ? (
          approved.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <CommenterAvatar name={comment.name} size={38} />
              <div>
                <div>
                  <span className="c-name">{comment.name}</span>
                  <span className="c-date">{comment.date}</span>
                </div>
                <p className="c-text">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">No approved comments yet. Be the first to leave a thought.</p>
        )}

        <CommentForm articleId={article.id} onSubmitted={setComments} showToast={showToast} />
      </section>
    </div>
  );
}
