const STORAGE_KEY = 'barkha_comments_v2';
const CONTACT_KEY = 'barkha_contact_messages';
const LEGACY_CONTACT_KEY = 'barkha_contact_messages_v1';

export const getComments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveComments = (comments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
};

export const addComment = (comment) => {
  const comments = getComments();
  const next = [...comments, comment];
  saveComments(next);
  return next;
};

export const saveContactMessage = (message) => {
  const messages = getContactMessages();
  saveContactMessages([...messages, message]);
};

export const getContactMessages = () => {
  try {
    const current = localStorage.getItem(CONTACT_KEY);
    if (current) return JSON.parse(current);
    return JSON.parse(localStorage.getItem(LEGACY_CONTACT_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveContactMessages = (messages) => {
  localStorage.setItem(CONTACT_KEY, JSON.stringify(messages));
};
