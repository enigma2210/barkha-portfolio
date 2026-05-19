import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { PERSON } from '../../data/siteData';
import { useScrolled } from '../../hooks/useScrolled';

const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/articles', label: 'Articles' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/media', label: 'Media' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/events', label: 'Events' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

function isActivePath(pathname, itemPath) {
  if (itemPath === '/') return pathname === '/';
  if (itemPath === '/articles') return pathname.startsWith('/articles') || pathname.startsWith('/blog');
  if (itemPath === '/media') return pathname === '/media';
  if (itemPath === '/gallery') return pathname === '/gallery';
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function MagneticLink({ item, onNavigate }) {
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    x.set(Math.max(-4, Math.min(4, dx)));
    y.set(Math.max(-4, Math.min(4, dy)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onNavigate}
      className={({ isActive }) => (isActive ? 'nav-link active magnetic' : 'nav-link magnetic')}
    >
      <motion.span style={{ x, y, display: 'inline-block' }}>
        {item.label}
      </motion.span>
    </NavLink>
  );
}

export function Nav() {
  const scrolled = useScrolled(20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleMouseDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const closeOnScroll = () => setMobileOpen(false);
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeOnScroll);
  }, [mobileOpen]);

  return (
    <nav id="nav" className={scrolled ? 'nav-root scrolled' : 'nav-root'} ref={navRef}>
      <div className="nav-inner">
        <Link className="nav-brand" to="/" onClick={closeMenu} aria-label="Go to home">
          <span className="nav-brand-en">{PERSON.nameEn}</span>
          <span className="nav-brand-hi">{PERSON.nameHi}</span>
        </Link>

        <ul className="nav-links">
          {LINKS.map((item) => (
            <li key={item.path}>
              <MagneticLink item={item} onNavigate={closeMenu} />
            </li>
          ))}
        </ul>

        <button
          className="nav-menu-btn"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="nav-menu-bars" aria-hidden="true">
            <motion.span
              className="nav-menu-bar"
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <motion.span
              className="nav-menu-bar"
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <motion.span
              className="nav-menu-bar"
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (
                  isActive || isActivePath(location.pathname, item.path)
                    ? 'mobile-menu-link active'
                    : 'mobile-menu-link'
                )}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
