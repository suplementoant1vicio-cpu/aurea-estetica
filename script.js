(() => {
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

  document.querySelectorAll('.treatmentToggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const article = btn.closest('.treatmentItem');
      const id = btn.getAttribute('aria-controls');
      const panel = document.getElementById(id);
      if (!article || !panel) return;
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('aria-hidden', String(open));
      article.classList.toggle('expanded', !open);
    });
  });

  document.querySelectorAll('.faqList article').forEach((article) => {
    const btn = article.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = article.classList.contains('open');
      document.querySelectorAll('.faqList article').forEach((a) => {
        a.classList.remove('open');
        a.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        article.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
