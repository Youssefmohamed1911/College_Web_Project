/* -------------------------------------------------------
   1. GLOBAL SCROLL HANDLER (Consolidated)
   Handles Navbar, Back-to-Top, and Zip-Up animations
   in a single requestAnimationFrame loop.
------------------------------------------------------- */

const navbar     = document.getElementById('navbar');
const backTopBtn = document.getElementById('backTop');

let lastScrollY = window.scrollY;
let isTicking   = false;

// Zip-Up Config
const SCROLL_RANGE = window.innerHeight * 0.55;
const LIFT_START   = 48;
const EASE_POW     = 2.2;

function easeInOut(t) {
  return t < 0.5
    ? Math.pow(2 * t, EASE_POW) / 2
    : 1 - Math.pow(2 * (1 - t), EASE_POW) / 2;
}

// Prepare Zip-Up Data
const zipSections = Array.from(document.querySelectorAll('section:not(.hero), footer'));
const zipData = zipSections.map((section, i) => {
  section.classList.add('zip-section');
  
  const wrapper = document.createElement('div');
  wrapper.className = 'zip-wrapper';
  wrapper.style.cssText = `position: relative; z-index: ${10 + i};`;
  section.parentNode.insertBefore(wrapper, section);
  wrapper.appendChild(section);

  section.style.cssText = `
    position: relative;
    z-index: 1;
    box-shadow: 0 -28px 80px rgba(0,0,0,0.55), 0 -6px 24px rgba(0,0,0,0.35);
    will-change: clip-path, transform;
    clip-path: inset(100% 0 0 0 round 0px);
    transform: translateY(${LIFT_START}px);
  `;

  return {
    el: section,
    wrapper: wrapper,
    offset: 0 // Will be updated on refreshZipOffsets
  };
});

function refreshZipOffsets() {
  zipData.forEach(data => {
    data.offset = data.wrapper.offsetTop;
  });
}

function updateScroll() {
  const scrollY = window.scrollY;
  const winH    = window.innerHeight;

  // 1. Navbar Toggle
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);

  // 2. Back to Top Toggle
  if (backTopBtn) backTopBtn.classList.toggle('visible', scrollY > 400);

  // 3. Zip-Up Animation
  zipData.forEach((data, i) => {
    const section = data.el;
    // Use cached offset instead of getBoundingClientRect()
    const rectTop = data.offset - scrollY;
    
    const raw      = 1 - (rectTop / (winH - SCROLL_RANGE * 0.15));
    const progress = Math.max(0, Math.min(1, raw));
    const eased    = easeInOut(progress);

    if (progress <= 0) {
      section.style.clipPath  = 'inset(100% 0 0 0 round 0px)';
      section.style.transform = `translateY(${LIFT_START}px)`;
      section.style.filter    = '';
    } else if (progress >= 1) {
      section.style.clipPath  = 'inset(0% 0 0 0 round 0px)';
      section.style.transform = 'translateY(0px)';
      section.style.filter    = '';

      if (i > 0) {
        const prev = zipData[i - 1].el;
        prev.style.filter     = 'brightness(0.65) saturate(0.75)';
        prev.style.transform  = 'scale(0.975) translateY(-10px)';
        prev.style.transition = 'filter 0.5s ease, transform 0.5s ease';
      }
    } else {
      const clipPct  = (1 - eased) * 100;
      const liftPx   = (1 - eased) * LIFT_START;

      section.style.clipPath  = `inset(${clipPct.toFixed(2)}% 0 0 0 round 0px)`;
      section.style.transform = `translateY(${liftPx.toFixed(2)}px)`;
      section.style.filter    = '';

      if (i > 0) {
        const prev       = zipData[i - 1].el;
        const scaleDelta = 0.025 * eased;
        const yDelta     = 10 * eased;
        const brightness = 1 - 0.35 * eased;
        const saturation = 1 - 0.25 * eased;
        prev.style.transition = 'none';
        prev.style.filter     = `brightness(${brightness.toFixed(3)}) saturate(${saturation.toFixed(3)})`;
        prev.style.transform  = `scale(${(1 - scaleDelta).toFixed(4)}) translateY(-${yDelta.toFixed(2)}px)`;
      }
    }
  });

  isTicking = false;
}

window.addEventListener('scroll', () => {
  if (!isTicking) {
    requestAnimationFrame(updateScroll);
    isTicking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  refreshZipOffsets();
  requestAnimationFrame(updateScroll);
});

// Initial run
refreshZipOffsets();
requestAnimationFrame(updateScroll);


/* -------------------------------------------------------
   2. BURGER TOGGLE
------------------------------------------------------- */

const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (burger) burger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
  });
});


/* -------------------------------------------------------
   3. PREMIUM SCROLL REVEAL (IntersectionObserver)
------------------------------------------------------- */

const ALL_REVEAL_SELECTORS = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const revealElements = document.querySelectorAll(ALL_REVEAL_SELECTORS);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

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
   4. SECTION ENTER ANIMATION
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
   5. ANIMATED COUNTERS
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
   6. PROJECT FILTER
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
        card.style.transitionDelay = `${i * 40}ms`;
        setTimeout(() => { card.style.transitionDelay = ''; }, 600);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* -------------------------------------------------------
   7. CONTACT FORM
------------------------------------------------------- */

const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}
function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    ['name','email','message'].forEach(id => clearError(id, id + 'Error'));
    if (formSuccess) formSuccess.classList.remove('visible');

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    const name    = nameEl ? nameEl.value.trim() : '';
    const email   = emailEl ? emailEl.value.trim() : '';
    const message = messageEl ? messageEl.value.trim() : '';
    let isValid   = true;

    if (name.length < 2)          { showError('name',    'nameError',    'Please enter your full name.');                              isValid = false; }
    if (!isValidEmail(email))     { showError('email',   'emailError',   'Please enter a valid email address.');                      isValid = false; }
    if (message.length < 20)      { showError('message', 'messageError', 'Please provide a brief project description (min. 20 chars).'); isValid = false; }

    if (!isValid) return;

    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = 'Send Enquiry';
        submitBtn.disabled    = false;
      }
      if (formSuccess) formSuccess.classList.add('visible');
      form.reset();
    }, 1500);
  });

  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id, id + 'Error'));
  });
}


/* -------------------------------------------------------
   8. SMOOTH ANCHOR LINKS
------------------------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 12 : 12;
    const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* -------------------------------------------------------
   9. CURSOR GLOW
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

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();