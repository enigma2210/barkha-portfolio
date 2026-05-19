import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArticleEditor } from './admin/ArticleEditor';
import {
  getComments,
  getContactMessages,
  saveComments,
  saveContactMessages,
} from '../data/comments';
import { AuthorAvatar } from '../components/ui/AuthorAvatar';
import { PERSON } from '../data/siteData';
import { getProfile, saveProfile } from '../utils/profileStorage';
import {
  getCurrentSession,
  signInAdmin,
  signOutAdmin,
  subscribeToAuthChanges,
} from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const SETTINGS_KEY = 'barkha_settings_v1';
const PAGE_SIZE = 10;

const NAV_ITEMS = [
  { id: 'overview', icon: '\uD83D\uDCCA', label: 'Overview' },
  { id: 'comments', icon: '\uD83D\uDCAC', label: 'Comments' },
  { id: 'editor', icon: '\u270D\uFE0F', label: 'Write Article' },
  { id: 'profile', icon: '\uD83D\uDC64', label: 'My Profile' },
  { id: 'messages', icon: '\uD83D\uDCEC', label: 'Messages' },
  { id: 'settings', icon: '\u2699\uFE0F', label: 'Settings' },
];

const ARTICLE_FILTERS = [
  ['all', 'All Articles'],
  ['dpdp', 'DPDP'],
  ['nist', 'NIST'],
  ['ai-summit', 'AI Summit'],
  ['backbone', 'Backbone'],
  ['igf', 'IGF'],
  ['influencers', 'Influencers'],
  ['pit', 'PIT'],
];

const STAT_CARDS = [
  ['total', 'Total', 'var(--sky-400)'],
  ['pending', 'Pending', 'var(--gold)'],
  ['approved', 'Approved', 'var(--mint-600)'],
  ['rejected', 'Rejected', '#ef4444'],
];

const DEFAULT_SETTINGS = {
  autoApproveVerified: false,
  emailNotifications: false,
  showCommentCount: true,
};

const INITIAL_GRADIENTS = [
  'linear-gradient(135deg, var(--sky-400), var(--sky-500))',
  'linear-gradient(135deg, var(--teal-400), var(--sky-500))',
  'linear-gradient(135deg, var(--gold), var(--sky-500))',
  'linear-gradient(135deg, var(--mint-600), var(--text-teal-dark))',
];

function truncate(value, max) {
  const text = String(value || '');
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(next) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

function articleTitle(articleId) {
  return articleId || 'Unknown article';
}

function normalStatus(status) {
  return ['pending', 'approved', 'rejected'].includes(status) ? status : 'pending';
}

function getCommentTimestamp(comment) {
  const created = Date.parse(comment.createdAt || '');
  if (!Number.isNaN(created)) return created;

  const dated = Date.parse(comment.date || '');
  if (!Number.isNaN(dated)) return dated;

  const fromId = String(comment.id || '').match(/\d+/)?.[0];
  return fromId ? Number(fromId) : 0;
}

function getMessageTimestamp(message) {
  const dated = Date.parse(message.date || message.createdAt || '');
  if (!Number.isNaN(dated)) return dated;

  const fromId = String(message.id || '').match(/\d+/)?.[0];
  return fromId ? Number(fromId) : 0;
}

function formatDate(value) {
  const timestamp = Date.parse(value || '');
  if (Number.isNaN(timestamp)) return value || 'No date';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCommentDate(comment) {
  if (comment.date) return formatDate(comment.date);
  const timestamp = getCommentTimestamp(comment);
  return timestamp ? formatDate(new Date(timestamp).toISOString()) : 'No date';
}

function timeAgo(timestamp) {
  if (!timestamp) return 'No date';
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function CommentInitial({ name, size = 32 }) {
  const initial = String(name || '?').trim().charAt(0).toUpperCase() || '?';
  const index = initial.charCodeAt(0) % INITIAL_GRADIENTS.length;

  return (
    <span
      className="comment-initial"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: INITIAL_GRADIENTS[index],
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

function StatusBadge({ status }) {
  const cleanStatus = normalStatus(status);
  return <span className={`sbadge s-${cleanStatus}`}>{cleanStatus}</span>;
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={checked ? 'admin-toggle is-on' : 'admin-toggle'}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
    >
      <motion.span
        layout
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </button>
  );
}

function AdminSidebar({ activeSection, setActiveSection, onLogout, profile, closeMobile }) {
  const navigate = (id) => {
    setActiveSection(id);
    closeMobile();
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-profile">
        <AuthorAvatar size={72} style={{ margin: '0 auto 0.75rem' }} />
        <p className="admin-sidebar-name">{profile.displayName || PERSON.nameEn}</p>
        <p className="admin-sidebar-role">Administrator</p>
      </div>

      <nav className="admin-side-nav" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            className={activeSection === item.id ? 'admin-side-link is-active' : 'admin-side-link'}
            key={item.id}
            onClick={() => navigate(item.id)}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button className="admin-logout-btn" type="button" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}

function OverviewPanel({ stats, comments }) {
  const recentActivity = useMemo(
    () => comments
      .slice()
      .sort((a, b) => getCommentTimestamp(b) - getCommentTimestamp(a))
      .slice(0, 5),
    [comments],
  );

  return (
    <div className="admin-panel-grid">
      <div className="admin-metric-grid">
        {STAT_CARDS.map(([key, label, color]) => (
          <div className="admin-metric-card" key={key} style={{ borderTopColor: color }}>
            <strong>{stats[key]}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="admin-content-card">
        <div className="admin-card-head">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest comment submissions from article pages.</p>
          </div>
        </div>

        <div className="admin-activity-list">
          {recentActivity.length ? (
            recentActivity.map((comment) => (
              <div className="admin-activity-item" key={comment.id}>
                <CommentInitial name={comment.name} size={36} />
                <div className="admin-activity-copy">
                  <strong>{comment.name || 'Anonymous'}</strong>
                  <span>{truncate(articleTitle(comment.articleId), 64)}</span>
                </div>
                <div className="admin-activity-side">
                  <StatusBadge status={comment.status} />
                  <span>{timeAgo(getCommentTimestamp(comment))}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">{'\uD83D\uDCAC'}</span>
              <strong>No comments yet</strong>
              <p>Recent comment activity will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentsPanel({ comments, setStatus, remove, bulkUpdate, bulkDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [articleFilter, setArticleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return comments
      .filter((comment) => statusFilter === 'all' || normalStatus(comment.status) === statusFilter)
      .filter((comment) => articleFilter === 'all' || comment.articleId === articleFilter)
      .filter((comment) => {
        if (!query) return true;
        return [
          comment.name,
          comment.email,
          comment.text,
          articleTitle(comment.articleId),
        ].some((value) => String(value || '').toLowerCase().includes(query));
      })
      .sort((a, b) => getCommentTimestamp(b) - getCommentTimestamp(a));
  }, [articleFilter, comments, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const selectedActiveIds = selectedIds.filter((id) => comments.some((comment) => comment.id === id));
  const allVisibleSelected = visible.length > 0 && visible.every((comment) => selectedActiveIds.includes(comment.id));

  const resetPage = (callback) => {
    callback();
    setPage(1);
  };

  const toggleSelected = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const toggleVisible = () => {
    setSelectedIds((current) => {
      const visibleIds = visible.map((comment) => comment.id);
      if (visibleIds.every((id) => current.includes(id))) {
        return current.filter((id) => !visibleIds.includes(id));
      }
      return [...new Set([...current, ...visibleIds])];
    });
  };

  const runBulkUpdate = (status) => {
    bulkUpdate(selectedActiveIds, status);
    setSelectedIds([]);
  };

  const runBulkDelete = () => {
    bulkDelete(selectedActiveIds);
    setSelectedIds([]);
  };

  return (
    <div className="admin-content-card admin-comments-shell">
      <div className="admin-comments-topbar">
        <input
          className="admin-search-input"
          type="search"
          placeholder="Search comments..."
          value={search}
          onChange={(event) => resetPage(() => setSearch(event.target.value))}
        />
        <div className="admin-filter-row">
          {['all', 'pending', 'approved', 'rejected'].map((item) => (
            <button
              className={statusFilter === item ? 'admin-filter is-active' : 'admin-filter'}
              type="button"
              key={item}
              onClick={() => resetPage(() => setStatusFilter(item))}
            >
              {item === 'all' ? 'All' : item}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-article-filter" aria-label="Article filter">
        {ARTICLE_FILTERS.map(([id, label]) => (
          <button
            className={articleFilter === id ? 'admin-article-pill is-active' : 'admin-article-pill'}
            type="button"
            key={id}
            onClick={() => resetPage(() => setArticleFilter(id))}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-bulk-row">
        <label>
          <input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} disabled={!visible.length} />
          Select page
        </label>
        <span>{selectedActiveIds.length} selected</span>
        <button className="act-btn act-approve" type="button" disabled={!selectedActiveIds.length} onClick={() => runBulkUpdate('approved')}>
          Approve Selected
        </button>
        <button className="act-btn act-reject" type="button" disabled={!selectedActiveIds.length} onClick={() => runBulkUpdate('rejected')}>
          Reject Selected
        </button>
        <button className="act-btn act-delete" type="button" disabled={!selectedActiveIds.length} onClick={runBulkDelete}>
          Delete Selected
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-comments-table">
          <colgroup>
            <col className="col-commenter" />
            <col className="col-article" />
            <col className="col-comment" />
            <col className="col-date" />
            <col className="col-status" />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Commenter</th>
              <th>Article</th>
              <th>Comment Preview</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((comment) => {
                const status = normalStatus(comment.status);
                return (
                  <tr key={comment.id}>
                    <td>
                      <div className="admin-commenter-cell">
                        <input
                          type="checkbox"
                          checked={selectedActiveIds.includes(comment.id)}
                          onChange={() => toggleSelected(comment.id)}
                          aria-label={`Select comment from ${comment.name}`}
                        />
                        <CommentInitial name={comment.name} size={32} />
                        <div>
                          <strong>{comment.name || 'Anonymous'}</strong>
                          <span>{truncate(comment.email, 28)}</span>
                        </div>
                      </div>
                    </td>
                    <td title={articleTitle(comment.articleId)}>{truncate(articleTitle(comment.articleId), 34)}</td>
                    <td title={comment.text}>{truncate(comment.text, 90)}</td>
                    <td>{formatCommentDate(comment)}</td>
                    <td><StatusBadge status={status} /></td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="act-btn act-approve" type="button" disabled={status === 'approved'} onClick={() => setStatus(comment.id, 'approved')}>
                          Approve
                        </button>
                        <button className="act-btn act-reject" type="button" disabled={status === 'rejected'} onClick={() => setStatus(comment.id, 'rejected')}>
                          Reject
                        </button>
                        <button className="act-btn act-delete" type="button" onClick={() => remove(comment.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <span aria-hidden="true">{'\uD83D\uDCAC'}</span>
                    <strong>No comments yet</strong>
                    <p>No comments match the current filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE ? (
        <div className="admin-pagination">
          <span>
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div>
            <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Previous
            </button>
            <span>Page {safePage} of {pageCount}</span>
            <button type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfilePanel({ setGlobalProfile, showToast }) {
  const [profile, setProfile] = useState(() => getProfile());
  const [previewUrl, setPreviewUrl] = useState(profile.avatarDataUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  function handleSave() {
    setSaveStatus('saving');
    const updated = {
      ...profile,
      avatarDataUrl: previewUrl,
      displayName: profile.displayName || PERSON.nameEn,
      title: profile.title || PERSON.profileTitle,
      email: profile.email || PERSON.email,
    };
    const saved = saveProfile(updated);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'barkha_profile_v1',
      newValue: JSON.stringify(saved),
    }));
    setProfile(saved);
    setGlobalProfile(saved);
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2500);
    showToast('Profile saved.');
  }

  return (
    <div className="admin-profile-shell">
      <h2>My Profile</h2>

      <div className="admin-profile-card">
        <div className="admin-profile-upload-row">
          <div className="admin-profile-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" />
            ) : (
              <div>BM</div>
            )}
          </div>

          <div
            className={isDragging ? 'admin-dropzone is-dragging' : 'admin-dropzone'}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
            }}
          >
            <p>{'\uD83D\uDCF8'}</p>
            <span><strong>Click to upload</strong> or drag and drop</span>
            <small>PNG, JPG, WEBP - max 5MB</small>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => handleFile(event.target.files[0])}
            />
          </div>
        </div>

        <div className="admin-profile-fields">
          {[
            ['displayName', 'Display Name', PERSON.nameEn],
            ['title', 'Title / Role', PERSON.profileTitle],
            ['email', 'Email', PERSON.email],
          ].map(([key, label, placeholder]) => (
            <div key={key}>
              <label htmlFor={`profile-${key}`}>{label}</label>
              <input
                id={`profile-${key}`}
                type={key === 'email' ? 'email' : 'text'}
                value={profile[key] || ''}
                placeholder={placeholder}
                onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
              />
            </div>
          ))}
        </div>

        <button className={saveStatus === 'saved' ? 'admin-save-profile is-saved' : 'admin-save-profile'} type="button" disabled={saveStatus === 'saving'} onClick={handleSave}>
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '\u2713 Profile Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

function MessagesPanel({ messages, removeMessage }) {
  const [expandedId, setExpandedId] = useState(null);
  const sorted = useMemo(
    () => messages.slice().sort((a, b) => getMessageTimestamp(b) - getMessageTimestamp(a)),
    [messages],
  );

  return (
    <div className="admin-content-card admin-messages-shell">
      <div className="admin-table-wrap">
        <table className="admin-messages-table">
          <colgroup>
            <col className="col-sender" />
            <col className="col-email" />
            <col className="col-message" />
            <col className="col-date" />
            <col className="col-message-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Email</th>
              <th>Message Preview</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length ? (
              sorted.map((message) => (
                <Fragment key={message.id}>
                  <tr>
                    <td>{message.name || 'Anonymous'}</td>
                    <td title={message.email}>{truncate(message.email || 'No email', 34)}</td>
                    <td title={message.message}>{truncate(message.message, 90)}</td>
                    <td>{formatDate(message.date)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="act-btn act-view" type="button" onClick={() => setExpandedId((value) => (value === message.id ? null : message.id))}>
                          {expandedId === message.id ? 'Hide' : 'View'}
                        </button>
                        <button className="act-btn act-delete" type="button" onClick={() => removeMessage(message.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === message.id ? (
                    <tr className="admin-expanded-row">
                      <td colSpan="5">{message.message}</td>
                    </tr>
                  ) : null}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <span aria-hidden="true">{'\uD83D\uDCEC'}</span>
                    <strong>No messages yet.</strong>
                    <p>Contact form messages will appear here.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPanel({ showToast }) {
  const [settings, setSettings] = useState(() => getSettings());

  const updateSetting = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveSettings(next);
  };

  return (
    <div className="admin-settings-stack">
      <div className="admin-content-card">
        <div className="admin-card-head">
          <div>
            <h3>Settings</h3>
            <p>Preferences are stored locally in this browser.</p>
          </div>
        </div>

        <div className="admin-settings-list">
          {[
            ['autoApproveVerified', 'Auto-approve comments from verified emails', 'default off'],
            ['emailNotifications', 'Email notifications for new comments', 'informational only'],
            ['showCommentCount', 'Show comment count on blog cards', 'default on'],
          ].map(([key, label, hint]) => (
            <div className="admin-setting-row" key={key}>
              <div>
                <strong>{label}</strong>
                <span>{hint}</span>
              </div>
              <ToggleSwitch checked={Boolean(settings[key])} onChange={() => updateSetting(key)} label={label} />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-content-card admin-password-card">
        <div className="admin-card-head">
          <div>
            <h3>Authentication</h3>
            <p>Admin access is managed through Supabase Auth and the admin_users table.</p>
          </div>
        </div>
        <p className="admin-muted">
          Create or update admin accounts in Supabase Auth. To grant publishing access, add the user's
          Auth UUID to <code>public.admin_users</code>.
        </p>
      </div>
    </div>
  );
}

export function Admin({ showToast, go }) {
  const notify = (message) => showToast?.(message);
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeSection, setActiveSection] = useState(
    location.pathname.includes('/admin/articles') || location.pathname.includes('/admin/new-article')
      ? 'editor'
      : 'overview',
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [comments, setComments] = useState(() => getComments());
  const [messages, setMessages] = useState(() => getContactMessages());
  const [profile, setProfile] = useState(() => getProfile());

  const stats = useMemo(
    () => ({
      total: comments.length,
      pending: comments.filter((item) => normalStatus(item.status) === 'pending').length,
      approved: comments.filter((item) => normalStatus(item.status) === 'approved').length,
      rejected: comments.filter((item) => normalStatus(item.status) === 'rejected').length,
    }),
    [comments],
  );

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const currentSession = await getCurrentSession();
        if (active) setSession(currentSession);
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    loadSession();
    const unsubscribe = subscribeToAuthChanges((nextSession) => setSession(nextSession));

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/admin/articles') || location.pathname.includes('/admin/new-article')) {
      setActiveSection('editor');
    }
  }, [location.pathname]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const nextSession = await signInAdmin(credentials.email, credentials.password);
      setSession(nextSession);
      setCredentials({ email: '', password: '' });
      setLoginError(false);
      return;
    } catch {
      setLoginError(true);
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  const commitComments = (next, message) => {
    setComments(next);
    saveComments(next);
    notify(message);
  };

  const setStatus = (id, status) => {
    commitComments(
      comments.map((comment) => (comment.id === id ? { ...comment, status } : comment)),
      `Comment ${status}.`,
    );
  };

  const remove = (id) => {
    commitComments(
      comments.filter((comment) => comment.id !== id),
      'Comment deleted.',
    );
  };

  const bulkUpdate = (ids, status) => {
    if (!ids.length) return;
    const selected = new Set(ids);
    commitComments(
      comments.map((comment) => (selected.has(comment.id) ? { ...comment, status } : comment)),
      `${ids.length} comment${ids.length === 1 ? '' : 's'} ${status}.`,
    );
  };

  const bulkDelete = (ids) => {
    if (!ids.length) return;
    const selected = new Set(ids);
    commitComments(
      comments.filter((comment) => !selected.has(comment.id)),
      `${ids.length} comment${ids.length === 1 ? '' : 's'} deleted.`,
    );
  };

  const removeMessage = (id) => {
    const next = messages.filter((message) => message.id !== id);
    setMessages(next);
    saveContactMessages(next);
    notify('Message deleted.');
  };

  const logout = async () => {
    await signOutAdmin();
    setSession(null);
    setActiveSection('overview');
    setSidebarOpen(false);
  };

  const sectionTitle = NAV_ITEMS.find((item) => item.id === activeSection)?.label || 'Overview';

  const renderSection = () => {
    switch (activeSection) {
      case 'comments':
        return <CommentsPanel comments={comments} setStatus={setStatus} remove={remove} bulkUpdate={bulkUpdate} bulkDelete={bulkDelete} />;
      case 'editor':
      case 'articles':
        return <ArticleEditor showToast={notify} />;
      case 'profile':
        return <ProfilePanel setGlobalProfile={setProfile} showToast={notify} />;
      case 'messages':
        return <MessagesPanel messages={messages} removeMessage={removeMessage} />;
      case 'settings':
        return <SettingsPanel showToast={notify} />;
      case 'overview':
      default:
        return <OverviewPanel stats={stats} comments={comments} />;
    }
  };

  if (authLoading) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-box">
          <AuthorAvatar size={64} style={{ margin: '0 auto 1rem' }} />
          <h2>Admin Portal</h2>
          <p className="admin-login-copy">Checking secure session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-login-screen">
        <motion.form
          className="admin-login-box"
          onSubmit={login}
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AuthorAvatar size={64} style={{ margin: '0 auto 1rem' }} />
          <h2>Admin Portal</h2>
          <p className="admin-login-copy">{isSupabaseConfigured ? `${PERSON.nameEn} ${'\u00B7'} Supabase Auth` : 'Supabase is not configured.'}</p>
          {loginError ? (
            <div className="admin-error-banner">Login failed. Check admin email/password and admin_users access.</div>
          ) : null}
          {!isSupabaseConfigured ? (
            <div className="admin-error-banner">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using admin publishing.</div>
          ) : null}
          <div className="form-field u-mb-12">
            <label htmlFor="admin-email">Email</label>
            <input
              className="form-input"
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={credentials.email}
              onChange={(event) => {
                setCredentials((current) => ({ ...current, email: event.target.value }));
                setLoginError(false);
              }}
            />
          </div>
          <div className="form-field u-mb-12">
            <label htmlFor="admin-pw">Password</label>
            <input
              className="form-input"
              id="admin-pw"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(event) => {
                setCredentials((current) => ({ ...current, password: event.target.value }));
                setLoginError(false);
              }}
            />
          </div>
          <button className="admin-login-btn" type="submit" disabled={!isSupabaseConfigured}>
            Login
          </button>
        </motion.form>
        <button className="admin-back-link" type="button" onClick={() => go?.('home')}>
          {'\u2190'} Back to site
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <button className="admin-mobile-toggle" type="button" onClick={() => setSidebarOpen((value) => !value)}>
        {'\u2630'}
      </button>
      {sidebarOpen ? <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} /> : null}
      <div className={sidebarOpen ? 'admin-sidebar-wrap is-open' : 'admin-sidebar-wrap'}>
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={logout}
          profile={profile}
          closeMobile={() => setSidebarOpen(false)}
        />
      </div>

      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <span className="admin-kicker">Dashboard</span>
            <h1>{sectionTitle}</h1>
          </div>
          <div className="admin-header-profile">
            <AuthorAvatar size={48} />
            <div>
              <strong>{profile.displayName}</strong>
              <span>{profile.title}</span>
            </div>
          </div>
        </header>

        {renderSection()}
      </main>
    </div>
  );
}
