import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { PageTransition } from './components/layout/PageTransition';
import { SEO } from './components/seo/SEO';
import { Toast } from './components/ui/Toast';
import { useCursorGlow } from './hooks/useCursorGlow';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { Article } from './pages/Article';
import { Blogs } from './pages/Blogs';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Home } from './pages/Home';
import { IIRO } from './pages/IIRO';
import { Portfolio } from './pages/Portfolio';
import { Publications } from './pages/Publications';
import { SOCH } from './pages/SOCH';

function resetScrollPosition() {
  const reset = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('scroll-root')?.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
    document.querySelectorAll('.page, main, section').forEach((node) => {
      if (node.scrollTop) node.scrollTop = 0;
    });
  };

  reset();
  window.requestAnimationFrame(reset);
  window.setTimeout(reset, 0);
  window.setTimeout(reset, 80);
  window.setTimeout(reset, 280);
}

function useRouteScrollReset() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    resetScrollPosition();
  }, [location.pathname]);
}

function LegacyArticleRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/articles/${slug}`} replace />;
}

function AdminRoute({ showToast }) {
  const navigate = useNavigate();

  const go = (target) => {
    const pathMap = {
      home: '/',
      articles: '/articles',
      blogs: '/articles',
      portfolio: '/portfolio',
      media: '/media',
      gallery: '/media',
      events: '/events',
      publications: '/publications',
      about: '/about',
      contact: '/contact',
      soch: '/soch',
      iiro: '/iiro',
    };

    navigate(pathMap[target] || '/');
  };

  return <Admin showToast={showToast} go={go} />;
}

function PublicRoutes({ showToast }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/articles" element={<Blogs />} />
      <Route path="/articles/:slug" element={<Article showToast={showToast} />} />
      <Route path="/contact" element={<Contact showToast={showToast} />} />
      <Route path="/media" element={<Gallery />} />
      <Route path="/events" element={<Events />} />
      <Route path="/publications" element={<Publications />} />
      <Route path="/soch" element={<SOCH />} />
      <Route path="/iiro" element={<IIRO />} />
      <Route path="/gallery" element={<Navigate to="/media" replace />} />
      <Route path="/blogs" element={<Navigate to="/articles" replace />} />
      <Route path="/blog/:slug" element={<LegacyArticleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppShell({ showToast, toast }) {
  const location = useLocation();
  const glowRef = useRef(null);
  const isAdminRoute = location.pathname.startsWith('/admin');

  useCursorGlow(glowRef);
  useRouteScrollReset();

  if (isAdminRoute) {
    return (
      <>
        <Routes>
          <Route path="/admin" element={<AdminRoute showToast={showToast} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <>
      <SEO />
      <Nav />
      <div id="cursor-glow" ref={glowRef} />
      <div id="scroll-root">
        <PageTransition pageKey={location.pathname}>
          <PublicRoutes showToast={showToast} />
        </PageTransition>
        <Footer />
      </div>
      <Toast toast={toast} />
    </>
  );
}

export function App() {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message) {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }

  return <AppShell showToast={showToast} toast={toast} />;
}
