// Progressive enhancement only: header state, mobile menu, current-section marking,
// accordion toggling, and a review-only grid overlay (?grid=1).
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');

  // Header surface changes after 80px of scroll (VD §05 default)
  function onScroll() {
    header.setAttribute('data-scrolled', window.scrollY > 80 ? 'true' : 'false');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile full-screen menu
  function setMenu(open) {
    nav.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.setAttribute('data-menu-open', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // Mark the current section in the nav
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.setAttribute('aria-current', link.getAttribute('href') === '#' + entry.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) observer.observe(target);
    });
  }

  // Accordion pattern (VD §05)
  document.querySelectorAll('.t-acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.t-acc');
      var open = item.getAttribute('data-open') !== 'true';
      item.setAttribute('data-open', open ? 'true' : 'false');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Review-only grid overlay
  if (/[?&]grid=1\b/.test(window.location.search)) {
    var overlay = document.createElement('div');
    overlay.className = 'grid-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<div class="container"><div class="grid">' + new Array(7).join('<span></span>') + '</div></div>';
    document.body.appendChild(overlay);
  }
})();
