/* =====================================================
   ARCIS ENGINEERING CONSULTANCY — script.js
   =====================================================

   This file handles all interactive behaviour:
   1. Navbar — scroll effect + mobile burger menu
   2. Scroll Reveal — fade-in elements as you scroll
   3. Animated counters — count up numbers in hero stats
   4. Project filter — show/hide cards by category
   5. Contact form — validate inputs & show success message
   6. Back-to-top button — appear on scroll, smooth scroll up
===================================================== */


/* -------------------------------------------------------
   1. NAVBAR — scroll effect + burger toggle
------------------------------------------------------- */

const navbar    = document.getElementById('navbar');
const burger    = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Add/remove "scrolled" class when user scrolls past 60px
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Toggle the mobile menu open/closed
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* -------------------------------------------------------
   2. SCROLL REVEAL — fade elements into view
   Uses the Intersection Observer API:
   - We watch every element with class "reveal"
   - When it enters the viewport we add "visible"
   - CSS handles the actual animation (opacity + translateY)
------------------------------------------------------- */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Small staggered delay so cards don't all appear at once
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80); // 80ms between each element in this batch

        // Stop observing once revealed (we only animate in once)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,   // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px' // Slightly below the bottom of viewport
  }
);

revealElements.forEach(el => revealObserver.observe(el));


/* -------------------------------------------------------
   3. ANIMATED COUNTERS — count up to target numbers
   Targets: elements with data-target attribute inside hero
------------------------------------------------------- */

const counters = document.querySelectorAll('.stat-number[data-target]');

// We use another IntersectionObserver so the counter
// only starts when the hero stats scroll into view
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // Only run once
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(counter => counterObserver.observe(counter));

/**
 * Animates a counter from 0 to its data-target value.
 * @param {HTMLElement} el  — the element to animate
 */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;     // Total animation time in ms
  const start    = Date.now();

  function update() {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1); // 0 → 1
    // Ease-out: slows down near the end
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update); // Keep going until done
    } else {
      el.textContent = target; // Make sure we land exactly on target
    }
  }

  requestAnimationFrame(update);
}


/* -------------------------------------------------------
   4. PROJECT FILTER — show/hide cards by category
------------------------------------------------------- */

const filterButtons  = document.querySelectorAll('.filter-btn');
const projectCards   = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    // Update which button looks "active"
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter'); // "all", "structural", etc.

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        // Show this card
        card.classList.remove('hidden');
      } else {
        // Hide this card
        card.classList.add('hidden');
      }
    });
  });
});


/* -------------------------------------------------------
   5. CONTACT FORM — validation & fake submission
------------------------------------------------------- */

const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Helpers to show/clear error messages
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = message;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

// Validate a single email string with a simple regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Run validation on form submit
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop page reload

  // Reset previous errors
  clearError('name',    'nameError');
  clearError('email',   'emailError');
  clearError('message', 'messageError');
  formSuccess.classList.remove('visible');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;

  // Check full name
  if (name.length < 2) {
    showError('name', 'nameError', 'Please enter your full name.');
    isValid = false;
  }

  // Check email
  if (!isValidEmail(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  // Check message
  if (message.length < 20) {
    showError('message', 'messageError', 'Please provide a brief project description (min. 20 characters).');
    isValid = false;
  }

  if (!isValid) return; // Stop here if there are errors

  // ---- Simulate sending the form ----
  // In a real project you would use fetch() to POST to your server or API.
  // e.g:  fetch('/api/contact', { method:'POST', body: JSON.stringify({name, email, message}) })

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  setTimeout(() => {
    // Pretend the request succeeded after 1.5s
    submitBtn.textContent = 'Send Enquiry';
    submitBtn.disabled    = false;
    formSuccess.classList.add('visible');
    form.reset(); // Clear all fields
  }, 1500);
});

// Live validation — remove error as soon as user starts fixing it
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, id + 'Error');
  });
});


/* -------------------------------------------------------
   6. BACK-TO-TOP BUTTON
------------------------------------------------------- */

const backTopBtn = document.getElementById('backTop');

// Show button when scrolled down more than 400px
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backTopBtn.classList.add('visible');
  } else {
    backTopBtn.classList.remove('visible');
  }
});

// Scroll smoothly back to the top on click
backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* -------------------------------------------------------
   7. SMOOTH ANCHOR LINKS — account for fixed navbar height
------------------------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // Skip bare "#" links

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navbarHeight = navbar.offsetHeight; // Height of the fixed navbar
    const targetTop    = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});
