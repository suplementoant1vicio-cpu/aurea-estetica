(() => {
  // Mantém integralmente o visual aprovado e remove somente a frase sobre a foto do hero.
  document.querySelector('.heroVisual .imageNote')?.remove();

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

  // Guarda continuamente a posição para que Voltar/Avançar restaure exatamente o ponto anterior.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const scrollKey = `aurea:scroll:${location.pathname}${location.search}`;
  let scrollTimer = 0;
  const saveScroll = () => {
    const y = Math.round(window.scrollY);
    sessionStorage.setItem(scrollKey, String(y));
    history.replaceState({ ...(history.state || {}), aureaScrollY: y }, '');
  };
  const restoreScroll = () => {
    const stateY = history.state?.aureaScrollY;
    const storedY = Number(sessionStorage.getItem(scrollKey));
    const y = Number.isFinite(stateY) ? stateY : storedY;
    if (!Number.isFinite(y)) return;
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: 'auto' })));
  };

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(saveScroll, 80);
  }, { passive: true });
  document.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', saveScroll, { capture: true }));
  window.addEventListener('pagehide', saveScroll);
  window.addEventListener('beforeunload', saveScroll);
  window.addEventListener('pageshow', (event) => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (event.persisted || navigation?.type === 'back_forward') restoreScroll();
  });
  window.addEventListener('popstate', () => setTimeout(restoreScroll, 0));

  // Abre/fecha detalhes sem deslocar o ponto que a pessoa estava visualizando.
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
      requestAnimationFrame(() => window.scrollTo({ top: anchorY, left: 0, behavior: 'auto' }));
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
      requestAnimationFrame(() => window.scrollTo({ top: anchorY, left: 0, behavior: 'auto' }));
    });
  });
})();
