import { useEffect, useState } from 'react';
import { PERSON } from '../../data/siteData';
import { getProfile, PROFILE_KEY } from '../../utils/profileStorage';

export function AuthorAvatar({ size = 42, className = '', style: styleOverride, alt = PERSON.nameEn }) {
  const [avatarUrl, setAvatarUrl] = useState(() => getProfile().avatarDataUrl || null);

  useEffect(() => {
    const syncProfile = () => {
      const profile = getProfile();
      setAvatarUrl(profile.avatarDataUrl || null);
    };

    const onStorage = (event) => {
      if (event.key === PROFILE_KEY) {
        syncProfile();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('barkha-profile-updated', syncProfile);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('barkha-profile-updated', syncProfile);
    };
  }, []);

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--sky-400)',
    flexShrink: 0,
    ...styleOverride,
  };

  const fallbackStyle = {
    ...style,
    background: 'linear-gradient(135deg, var(--sky-400), var(--sky-500))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: size * 0.38,
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.05em',
  };

  if (avatarUrl) {
    return <img src={avatarUrl} alt={alt} style={style} className={className} />;
  }

  return (
    <div style={fallbackStyle} className={className} aria-label="Author avatar">
      BM
    </div>
  );
}
