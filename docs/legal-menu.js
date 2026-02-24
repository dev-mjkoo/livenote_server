(function () {
  const navs = document.querySelectorAll('.legal-nav');
  if (!navs.length) return;

  const closeAll = () => {
    navs.forEach((nav) => {
      nav.dataset.open = 'false';
      const button = nav.querySelector('.nav-toggle');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  navs.forEach((nav, index) => {
    const button = nav.querySelector('.nav-toggle');
    const panel = nav.querySelector('.nav-panel');
    if (!button || !panel) return;

    if (!panel.id) {
      panel.id = 'legal-menu-' + String(index + 1);
    }

    button.setAttribute('aria-controls', panel.id);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const shouldOpen = nav.dataset.open !== 'true';
      closeAll();
      if (shouldOpen) {
        nav.dataset.open = 'true';
        button.setAttribute('aria-expanded', 'true');
      }
    });

    panel.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
})();
