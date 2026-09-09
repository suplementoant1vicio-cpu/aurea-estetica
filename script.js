(() => {
  // Remove a frase sobreposta da imagem principal sem alterar a composição do hero.
  document.querySelector('.heroVisual .imageNote')?.remove();

  // Ajustes visuais globais: tipografia mais consistente e imagens sem escalonamento artificial.
  const polish = document.createElement('style');
  polish.textContent = `
    :root { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
    body, button, input, textarea, select { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
    p, a, button, li, small, span { letter-spacing: -0.01em; }
    h1, h2, h3, .manifestoHeading h2, .sectionIntro h2, .methodCopy h2, .professionalTitle h2, .faqTitle h2 { letter-spacing: -0.035em; text-wrap: balance; }
    img { image-rendering: auto; -webkit-transform: translateZ(0); backface-visibility: hidden; }
    .heroVisual img, .manifestoMedia img, .treatmentImage img, .treatmentDetailImage img, .methodImage img, .professionalPortrait img, .principleImage img { width: 100%; height: 100%; object-fit: cover; object-position: center; transform: none !important; }
    .heroVisual { overflow: hidden; }
    @media (max-width: 900px) {
      body { font-size: 16px; }
      .heroVisual img { object-position: center 35%; }
    }
  `;
  document.head.appendChild(polish);

  const menuBtn = document.querySelector('.menuButton');
  const mobileNav = document.querySelector('#mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Navegação com restauração precisa da posição anterior.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const pageKey = `aurea:scroll:${location.pathname}`;
  let scrollTimer;
  const savePosition = () => {
    sessionStorage.setItem(pageKey, String(Math.round(window.scrollY)));
    history.replaceState({ ...(history.state || {}), aureaScrollY: Math.round(window.scrollY) }, '');
  };
  const restorePosition = () => {
    const stateY = history.state?.aureaScrollY;
    const storedY = sessionStorage.getItem(pageKey);
    const y = Number.isFinite(stateY) ? stateY : Number(storedY || 0);
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: 'auto' })));
  };
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(savePosition, 90);
  }, { passive: true });
  window.addEventListener('pagehide', savePosition);
  window.addEventListener('beforeunload', savePosition);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') restorePosition();
  });
  window.addEventListener('popstate', () => setTimeout(restorePosition, 0));
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => savePosition(), { capture: true });
  });

  document.querySelectorAll('.treatmentToggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const article = btn.closest('.treatmentItem');
      const id = btn.getAttribute('aria-controls');
      const panel = document.getElementById(id);
      if (!article || !panel) return;
      const open = btn.getAttribute('aria-expanded') === 'true';
      const anchorY = window.scrollY;
      btn.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('aria-hidden', String(open));
      article.classList.toggle('expanded', !open);
      requestAnimationFrame(() => window.scrollTo({ top: anchorY, behavior: 'auto' }));
    });
  });

  document.querySelectorAll('.faqList article').forEach((article) => {
    const btn = article.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = article.classList.contains('open');
      const anchorY = window.scrollY;
      document.querySelectorAll('.faqList article').forEach((a) => {
        a.classList.remove('open');
        a.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        article.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
      requestAnimationFrame(() => window.scrollTo({ top: anchorY, behavior: 'auto' }));
    });
  });
})();
