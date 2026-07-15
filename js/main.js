var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme toggle
(function () {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// Mobile nav toggle
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  if (!navToggle) return;
  navToggle.addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  });
})();

// Active nav link
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// Header background on scroll
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Reveal on scroll
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        var staggerChildren = entry.target.querySelectorAll('[data-stagger]');
        staggerChildren.forEach(function (child, i) {
          child.style.setProperty('--i', i);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { observer.observe(el); });
})();

// Animated stat counters
(function () {
  var stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length) return;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    var start = 0;
    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animateCount);
    return;
  }

  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function (el) { statObserver.observe(el); });
})();

// Card tilt on mouse move (desktop only, respects reduced motion)
(function () {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.case-card:not(.case-card-disabled)').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

// Magnetic buttons
(function () {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = 'translate(' + (x * 8) + 'px, ' + (y * 8 - 2) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

// Keyword spotlight: types the full list out in one continuous pass,
// pauses, clears, and starts over. Skipped entirely if the user prefers
// reduced motion — the plain static sentence in the markup stays visible.
(function () {
  var container = document.getElementById('keyword-spotlight');
  var typedEl = document.getElementById('keyword-typed');
  if (!container || !typedEl || prefersReducedMotion) return;

  var words = ['Product design', 'Design systems', 'User research', 'AI-native design', 'Stakeholder alignment', 'Prototyping'];
  var fullText = words.join(' · ');

  container.classList.add('js-active');

  function typeFull(cb) {
    var i = 0;
    var timer = setInterval(function () {
      i++;
      typedEl.textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        clearInterval(timer);
        setTimeout(cb, 1800);
      }
    }, 35);
  }

  function resetAndRepeat() {
    typedEl.textContent = '';
    setTimeout(function () { typeFull(resetAndRepeat); }, 400);
  }

  typeFull(resetAndRepeat);
})();

// Password-gated design screens
(function () {
  var PASSWORD = 'superdesigner';
  var UNLOCK_DURATION_MS = 10 * 60 * 1000; // remember for 10 minutes
  var storageKey = 'pwUnlocked:' + window.location.pathname;

  var overlay = document.getElementById('password-modal-overlay');
  if (!overlay) return; // this page has no gated content

  var input = document.getElementById('password-input');
  var errorMsg = document.getElementById('password-error');
  var unlockBtn = document.getElementById('password-unlock-btn');
  var closeBtn = document.getElementById('password-modal-close');
  var toggleBtn = document.getElementById('password-toggle-visibility');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggleBtn.classList.toggle('showing', !showing);
      toggleBtn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }

  function revealAll() {
    document.querySelectorAll('.gated-content').forEach(function (el) {
      el.classList.add('revealed');
    });
    document.querySelectorAll('.lock-card').forEach(function (el) {
      el.style.display = 'none';
    });
  }

  function isUnlockStillValid() {
    var expiresAt = parseInt(localStorage.getItem(storageKey), 10);
    if (!expiresAt || isNaN(expiresAt)) return false;
    if (Date.now() > expiresAt) {
      localStorage.removeItem(storageKey);
      return false;
    }
    return true;
  }

  if (isUnlockStillValid()) {
    revealAll();
  }

  function openModal() {
    overlay.classList.add('open');
    errorMsg.classList.remove('show');
    input.value = '';
    input.type = 'password';
    if (toggleBtn) {
      toggleBtn.classList.remove('showing');
      toggleBtn.setAttribute('aria-label', 'Show password');
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  document.querySelectorAll('.open-password-modal').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  function attemptUnlock() {
    if (input.value.trim().toLowerCase() === PASSWORD) {
      localStorage.setItem(storageKey, String(Date.now() + UNLOCK_DURATION_MS));
      revealAll();
      closeModal();
    } else {
      errorMsg.classList.add('show');
    }
  }
  unlockBtn.addEventListener('click', attemptUnlock);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attemptUnlock();
  });
})();
