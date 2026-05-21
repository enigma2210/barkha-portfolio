import { useRef, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SEO } from './components/seo/SEO';
import { Toast } from './components/ui/Toast';
import { useCursorGlow } from './hooks/useCursorGlow';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { Article } from './pages/Article';
import { Blogs } from './pages/Blogs';
import { Contact } from './pages/Contact';
import { Gallery } from './pages/Gallery';
import { Home } from './pages/Home';
import { IIRO } from './pages/IIRO';
import { Portfolio } from './pages/Portfolio';
import { SOCH } from './pages/SOCH';

function LegacyArticleRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/articles/${slug}`} replace />;
}

function AdminRoute({ showToast, toast }) {
  const navigate = useNavigate();

  const go = (target) => {
    const pathMap = {
      home: '/',
      articles: '/articles',
      blogs: '/articles',
      portfolio: '/portfolio',
      gallery: '/gallery',
      about: '/about',
      contact: '/contact',
      soch: '/soch',
      iiro: '/iiro',
    };

    navigate(pathMap[target] || '/');
  };

  return (
    <>
      <ScrollToTop />
      <Admin showToast={showToast} go={go} />
      <Toast toast={toast} />
    </>
  );
}

function Layout({ toast }) {
  const location = useLocation();
  const glowRef = useRef(null);

  useCursorGlow(glowRef);

  return (
    <>
      <SEO />
      <ScrollToTop />
      <Nav />
      <div id="cursor-glow" ref={glowRef} />
      <div id="scroll-root">
        <PageTransition pageKey={location.pathname}>
          <Outlet />
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

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute showToast={showToast} toast={toast} />} />
      <Route element={<Layout toast={toast} />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="articles" element={<Blogs />} />
        <Route path="articles/:slug" element={<Article showToast={showToast} />} />
        <Route path="contact" element={<Contact showToast={showToast} />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="soch" element={<SOCH />} />
        <Route path="iiro" element={<IIRO />} />
        <Route path="blogs" element={<Navigate to="/articles" replace />} />
        <Route path="blog/:slug" element={<LegacyArticleRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
