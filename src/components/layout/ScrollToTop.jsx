import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function resetScrollPosition() {
  const reset = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('scroll-root')?.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  reset();
  window.requestAnimationFrame(reset);
}

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    resetScrollPosition();
  }, [pathname]);

  return null;
}
