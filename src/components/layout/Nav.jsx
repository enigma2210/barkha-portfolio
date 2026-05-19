import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PERSON } from '../../data/siteData';
import { useScrolled } from '../../hooks/useScrolled';

const LINKS = [
  { page: 'home', label: 'Home' },
  { page: 'blogs', label: 'Blogs' },
  { page: 'portfolio', label: 'My Portfolio' },
  { page: 'gallery', label: 'Gallery' },
  { page: 'about', label: 'About' },
  { page: 'soch', label: 'SOCH' },
  { page: 'iiro', label: 'IIRO' },
  { page: 'contact', label: 'Contact' },
];

function MagneticLink({ item, active, onNavigate }) {
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
    <motion.a
      href="#"
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(item.page);
      }}
      className={active ? 'nav-link active magnetic' : 'nav-link magnetic'}
    >
      {item.label}
    </motion.a>
  );
}

export function Nav({ page, go }) {
  const scrolled = useScrolled(20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const activePage = page === 'article' ? 'blogs' : page;

  const navigate = (nextPage) => {
    setMobileOpen(false);
    go(nextPage);
  };

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
        <button className="nav-brand" onClick={() => navigate('home')} aria-label="Go to home">
          <span className="nav-brand-en">{PERSON.nameEn}</span>
          <span className="nav-brand-hi">{PERSON.nameHi}</span>
        </button>

        <ul className="nav-links">
          {LINKS.map((item) => (
            <li key={item.page}>
              <MagneticLink item={item} active={activePage === item.page} onNavigate={navigate} />
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
              <button
                key={item.page}
                className={activePage === item.page ? 'mobile-menu-link active' : 'mobile-menu-link'}
                onClick={() => navigate(item.page)}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
