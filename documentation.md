# Technical Documentation: Vertex Engineering Website

This document provides a section-by-section breakdown of how the Vertex Engineering Consultancy website is constructed using HTML, CSS, and JavaScript.

---

## 1. Global Components

### Navigation Bar
*   **HTML**: Uses a `<nav>` with a 3-column flex layout (`nav-left`, `logo`, `nav-right`).
*   **CSS**: Implements **Glassmorphism** using `backdrop-filter: blur(16px)` and a semi-transparent background when scrolled (`.scrolled`).
*   **JS**: The `updateScroll` function monitors the scroll position and toggles the `.scrolled` class when you move past 60px.

### Cursor Glow
*   **HTML**: Dynamically created by JS as a `<div>`.
*   **CSS**: A large radial gradient with very low opacity (`0.04`) and `pointer-events: none` so it doesn't block clicks.
*   **JS**: Uses **Lerp (Linear Interpolation)** to make the glow follow the mouse with a "heavy", smooth movement instead of snapping instantly.

---

## 2. Hero Section (Structural Intelligence)
*   **HTML**: A `<section>` with a 2-column grid. Uses `<h1>` for the bold typography and a `hero-badge` for the status.
*   **CSS**: Uses the `Bebas Neue` font for a bold, industrial look. The "INTELLIGENCE" text has the `--accent` color.
*   **JS**: Uses the `Reveal` animation. It starts invisible and slides up into place once the page loads.

---

## 3. Services Section
*   **HTML**: A grid of `service-card` elements. Each card contains an SVG icon, a `service-number` (01, 02...), and a description.
*   **CSS**: 
    *   Cards use `background: var(--bg2)` and a `radial-gradient` on hover to create a spotlight effect.
    *   The `service-number` is positioned absolutely and made transparent to act as a background element.
*   **JS**: Part of the **Zip-Up** animation. As you scroll, this section "zips" up over the Hero section using `clip-path`.

---

## 4. Projects Portfolio
*   **HTML**: Contains `filter-buttons` and a `projects-grid`. Each project is a `project-card` with an overlay.
*   **CSS**: 
    *   The grid uses `grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))` for responsiveness.
    *   `project-overlay` uses a linear gradient from black to transparent to make text readable over images.
*   **JS**: 
    *   **Filtering**: When a button is clicked, JS compares the `data-filter` of the button with the `data-category` of the cards, adding/removing the `.hidden` class.
    *   **Smooth Fade**: Cards use `transition-delay` to appear one-by-one when filtered.

---

## 5. About Section (Vision)
*   **HTML**: Features a large background text "VISION" and a 2-column layout (`about-text` and `about-visual`).
*   **CSS**: The "VISION" text uses a very low opacity (`0.02`) and a massive font size to create an architectural background feel.
*   **JS**: Uses `reveal-left` and `reveal-right` to slide the text and image in from opposite sides as you scroll down.

---

## 6. Team Section
*   **HTML**: Divided into three tiers: Leader, Co-Leaders, and Members. 
*   **CSS**: 
    *   The **Team Leader** card has a unique `leader-glow` animation and a gradient background.
    *   Uses `border-radius: 50%` on images to create the circular profile look.
*   **JS**: 
    *   The **Pulse Animation**: The leader card has a CSS keyframe animation (`leaderPulse`) that makes the background glow grow and shrink.
    *   **Zip-Up**: This section slides up over the About section.

---

## 7. Contact Section
*   **HTML**: A 2-column layout with contact details on the left and a `<form>` on the right.
*   **CSS**: Uses `var(--bg2)` for a slight color shift. Inputs use a subtle glow (`box-shadow`) when focused.
*   **JS**: 
    *   **Validation**: JS prevents submission if fields are empty or the email format is wrong.
    *   **Success State**: After a 1.5s delay (simulating a server), it resets the form and shows a "Thank you" message.
    *   *Note: This section is excluded from the Zip-Up animation for a smoother transition to the footer.*

---

## 8. Footer
*   **HTML**: A 4-column grid layout with brand info, services links, company links, and social links.
*   **CSS**: Uses a dark slate background to ground the website. Links have a hover color change to the cyan accent.
*   **JS**: Static layout that flows naturally after the contact section.

---

## 9. Core Animations (The "Secret Sauce")

### Zip-Up Effect (`script.js`)
*   **Mechanism**: The script wraps sections in a container and calculates a `progress` value (0 to 1) based on scroll position.
*   **Math**: It applies `clip-path: inset(clipPct% 0 0 0)` where `clipPct` goes from 100 to 0. 
*   **Depth**: It scales down the *previous* section to `0.975` to make it look like it's being pushed into the background.

### Scroll Reveal (`IntersectionObserver`)
*   **Mechanism**: A modern browser API that "watches" elements.
*   **Action**: When an element with `.reveal` is 10% visible, the script adds `.visible`, which triggers the CSS transition: `opacity: 1` and `transform: translateY(0)`.
