import { PERSON } from '../data/siteData';

const PROFILE_KEY = 'barkha_profile_v1';

const DEFAULT_PROFILE = {
  avatarDataUrl: null,
  displayName: PERSON.nameEn,
  title: PERSON.profileTitle,
  email: PERSON.email,
};

export function getProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    return { ...DEFAULT_PROFILE, ...saved };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(data) {
  const next = { ...DEFAULT_PROFILE, ...data };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('barkha-profile-updated', { detail: next }));
  return next;
}

export { PROFILE_KEY };
