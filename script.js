/* =====================================================
   POWER ENGINEERING — script.js (Modern Rewrite)
   ===================================================== */


/* -------------------------------------------------------
   1. NAVBAR — scroll effect + burger toggle
------------------------------------------------------- */

const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* -------------------------------------------------------
   2. PREMIUM SCROLL REVEAL
   Supports four variants via CSS classes:
     .reveal       — fade + lift (default)
     .reveal-left  — slide from left
     .reveal-right — slide from right
     .reveal-scale — scale up
   All classes gain ".visible" when intersecting.
------------------------------------------------------- */

const ALL_REVEAL_SELECTORS = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const revealElements = document.querySelectorAll(ALL_REVEAL_SELECTORS);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // Stagger within a batch: multiply index by 65ms
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 65);

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));


/* -------------------------------------------------------
   3. SECTION ENTER ANIMATION
   Each <section> gets a subtle "wake-up" glow on the
   top border when it first enters the viewport.
------------------------------------------------------- */

const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-active');
      }
    });
  },
  { threshold: 0.08 }
);

sections.forEach(s => sectionObserver.observe(s));


/* -------------------------------------------------------
   4. ANIMATED COUNTERS — count up to data-target
------------------------------------------------------- */

const counters = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const start    = Date.now();

  function update() {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    // Quartic ease-out
    const eased    = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}


/* -------------------------------------------------------
   5. PROJECT FILTER — show/hide with smooth opacity
------------------------------------------------------- */

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach((card, i) => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;

      if (match) {
        card.classList.remove('hidden');
        // Stagger re-entrance
        card.style.transitionDelay = `${i * 40}ms`;
        setTimeout(() => { card.style.transitionDelay = ''; }, 600);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* -------------------------------------------------------
   6. CONTACT FORM — validation & simulated submit
------------------------------------------------------- */

const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, errorId, message) {
  document.getElementById(fieldId).classList.add('error');
  document.getElementById(errorId).textContent = message;
}
function clearError(fieldId, errorId) {
  document.getElementById(fieldId).classList.remove('error');
  document.getElementById(errorId).textContent = '';
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  ['name','email','message'].forEach(id => clearError(id, id + 'Error'));
  formSuccess.classList.remove('visible');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let isValid   = true;

  if (name.length < 2)          { showError('name',    'nameError',    'Please enter your full name.');                              isValid = false; }
  if (!isValidEmail(email))     { showError('email',   'emailError',   'Please enter a valid email address.');                      isValid = false; }
  if (message.length < 20)      { showError('message', 'messageError', 'Please provide a brief project description (min. 20 chars).'); isValid = false; }

  if (!isValid) return;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  setTimeout(() => {
    submitBtn.textContent = 'Send Enquiry';
    submitBtn.disabled    = false;
    formSuccess.classList.add('visible');
    form.reset();
  }, 1500);
});

['name','email','message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => clearError(id, id + 'Error'));
});


/* -------------------------------------------------------
   7. BACK-TO-TOP BUTTON
------------------------------------------------------- */

const backTopBtn = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* -------------------------------------------------------
   8. SMOOTH ANCHOR LINKS — offset for fixed navbar
------------------------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* -------------------------------------------------------
   9. CURSOR GLOW — subtle radial glow that follows mouse
   Adds an atmospheric depth to the dark background
------------------------------------------------------- */

const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 65%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.4s ease;
  z-index: 0;
  will-change: left, top;
`;
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth follow with lerp
function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();
animateGlow();

/* -------------------------------------------------------
   10. VERTEX MESH — (Disabled for Minimal Design)
------------------------------------------------------- */
/* =====================================================
   PREMIUM ZIP-UP SECTION TRANSITIONS
   
   Technique:
   - Each section (except hero) starts visually hidden
     via clip-path: inset(100% 0 0 0) — clipped from bottom
   - A "scroll sentinel" sits sticky at the top of each
     transition zone
   - As you scroll down, we map scroll progress (0→1)
     to clip-path inset (100%→0%) and translateY (32px→0)
   - This creates a smooth "zip up" / panel-lift effect
   - The previous section gets a subtle "bury" effect
     (slight scale-down + dim) as the new one covers it
===================================================== */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────── */
  const SCROLL_RANGE = window.innerHeight * 0.55; // px of scroll for full reveal
  const LIFT_START   = 48;                         // px of Y lift at start
  const EASE_POW     = 2.2;                        // ease curve exponent (>1 = ease-in-out feel)

  /* ── SECTIONS TO ZIP ──────────────────────────
     Query all main sections except the hero.
     Hero is always visible; everything else zips up.
  ─────────────────────────────────────────────── */
  const sections = Array.from(
    document.querySelectorAll('section:not(.hero), footer')
  );

  /* ── BUILD DOM STRUCTURE ──────────────────────
     For each target section we:
     1. Wrap it in a .zip-wrapper (relative, creates stacking context)
     2. Insert a .zip-spacer BEFORE the wrapper (creates scroll room)
     3. Apply .zip-section class to the section itself
  ─────────────────────────────────────────────── */
  sections.forEach((section, i) => {
    /* Add zip-section class */
    section.classList.add('zip-section');

    /* Wrap in a container that creates a stacking context */
    const wrapper = document.createElement('div');
    wrapper.className = 'zip-wrapper';
    wrapper.style.cssText = `
      position: relative;
      z-index: ${10 + i};
    `;
    section.parentNode.insertBefore(wrapper, section);
    wrapper.appendChild(section);

    /* Ensure section fills wrapper and has correct z + shadow */
    section.style.position = 'relative';
    section.style.zIndex   = '1';
    section.style.boxShadow = '0 -28px 80px rgba(0,0,0,0.55), 0 -6px 24px rgba(0,0,0,0.35)';
    section.style.willChange = 'clip-path, transform';

    /* Initial hidden state */
    section.style.clipPath  = 'inset(100% 0 0 0 round 0px)';
    section.style.transform = `translateY(${LIFT_START}px)`;
  });

  /* ── EASING ──────────────────────────────────── */
  function easeInOut(t) {
    /* Smooth step — feels premium and physical */
    return t < 0.5
      ? Math.pow(2 * t, EASE_POW) / 2
      : 1 - Math.pow(2 * (1 - t), EASE_POW) / 2;
  }

  /* ── ANIMATION LOOP ──────────────────────────── */
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const winH    = window.innerHeight;

    sections.forEach((section, i) => {
      const wrapper  = section.parentElement;  /* .zip-wrapper */
      const rect     = wrapper.getBoundingClientRect();

      /*
        rect.top is where the wrapper's TOP edge is relative to viewport.
        
        We want the zip to START when the wrapper top reaches
        the BOTTOM of the viewport (rect.top === winH)
        and FINISH when it's scrolled SCROLL_RANGE pixels past that.
        
        raw progress:
          0 = wrapper just entered from the bottom (zip starts)
          1 = wrapper has scrolled SCROLL_RANGE px further up (zip done)
      */
      const raw      = 1 - (rect.top / (winH - SCROLL_RANGE * 0.15));
      const progress = Math.max(0, Math.min(1, raw));
      const eased    = easeInOut(progress);

      if (progress <= 0) {
        /* Below viewport — keep hidden */
        section.style.clipPath  = 'inset(100% 0 0 0 round 0px)';
        section.style.transform = `translateY(${LIFT_START}px)`;
        section.style.filter    = '';
        return;
      }

      if (progress >= 1) {
        /* Fully revealed — lock to done state */
        section.style.clipPath  = 'inset(0% 0 0 0 round 0px)';
        section.style.transform = 'translateY(0px)';
        section.style.filter    = '';

        /* Bury the PREVIOUS section as this one fully covers it */
        if (i > 0) {
          const prev = sections[i - 1];
          prev.style.filter    = 'brightness(0.65) saturate(0.75)';
          prev.style.transform = 'scale(0.975) translateY(-10px)';
          prev.style.transition = 'filter 0.5s ease, transform 0.5s ease';
        }
        return;
      }

      /* ---- Animating: map eased progress to clip + translate ---- */
      /* clip: 100% → 0%  (inset from top = reveals from bottom up) */
      const clipPct  = (1 - eased) * 100;
      const liftPx   = (1 - eased) * LIFT_START;

      section.style.clipPath  = `inset(${clipPct.toFixed(2)}% 0 0 0 round 0px)`;
      section.style.transform = `translateY(${liftPx.toFixed(2)}px)`;
      section.style.filter    = '';

      /* Partially bury the previous section */
      if (i > 0) {
        const prev       = sections[i - 1];
        const scaleDelta = 0.025 * eased;
        const yDelta     = 10 * eased;
        const brightness = 1 - 0.35 * eased;
        const saturation = 1 - 0.25 * eased;
        prev.style.transition = 'none';
        prev.style.filter     = `brightness(${brightness.toFixed(3)}) saturate(${saturation.toFixed(3)})`;
        prev.style.transform  = `scale(${(1 - scaleDelta).toFixed(4)}) translateY(-${yDelta.toFixed(2)}px)`;
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    /* Recalc on resize */
    requestAnimationFrame(update);
  });

  /* Initial pass */
  requestAnimationFrame(update);

  /* ── NAVBAR STAYS ON TOP ─────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.style.zIndex = '9000';
  }
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.style.zIndex = '9001';
  }

})();