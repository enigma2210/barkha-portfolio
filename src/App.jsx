import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { PageTransition } from './components/layout/PageTransition';
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

export function App() {
  const [page, setPage] = useState('home');
  const [prevPage, setPrevPage] = useState('home');
  const [articleId, setArticleId] = useState(null);
  const [toast, setToast] = useState(null);
  const glowRef = useRef(null);
  const toastTimer = useRef(null);

  useCursorGlow(glowRef);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    resetScrollPosition();
  }, [page, articleId]);

  function showToast(message) {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }

  function go(newPage, options = {}) {
    resetScrollPosition();
    setPrevPage(page);
    if (options.articleId) {
      setArticleId(options.articleId);
    } else if (newPage !== 'article') {
      setArticleId(null);
    }
    setPage(newPage);
    resetScrollPosition();
  }

  function openArticle(id) {
    go('article', { articleId: id });
  }

  function renderPage() {
    switch (page) {
      case 'blogs':
        return <Blogs openArticle={openArticle} />;
      case 'article':
        return <Article articleId={articleId} onBack={() => go(prevPage || 'blogs')} showToast={showToast} />;
      case 'portfolio':
        return <Portfolio />;
      case 'gallery':
        return <Gallery />;
      case 'soch':
        return <SOCH />;
      case 'iiro':
        return <IIRO />;
      case 'about':
        return <About go={go} />;
      case 'contact':
        return <Contact showToast={showToast} />;
      case 'admin':
        return <Admin showToast={showToast} go={go} />;
      case 'home':
      default:
        return <Home go={go} openArticle={openArticle} />;
    }
  }

  if (page === 'admin') {
    return (
      <>
        <Admin showToast={showToast} go={go} />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <>
      <Nav page={page} go={go} />
      <div id="cursor-glow" ref={glowRef} />
      <div id="scroll-root">
        <PageTransition pageKey={`${page}-${articleId || 'none'}`}>
          {renderPage()}
        </PageTransition>
        <Footer go={go} />
      </div>
      <Toast toast={toast} />
    </>
  );
}
