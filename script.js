/**
 * ============================================================================
 * ARENA X – ESPORTS ARENA
 * Vanilla JavaScript (No Frameworks)
 * Features:
 *  1. Mobile Hamburger Menu Toggle & ARIA Accessibility
 *  2. Header Scroll Effect (Sticky backdrop changes)
 *  3. Active Navigation Spy (Updates active nav link based on scroll)
 *  4. Smooth Link Scrolling with Mobile Drawer Auto-Close
 *  5. Contact Form Client-side Validation & Interactive Feedback
 *  6. Tournament Registration Interactive Notifications
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. MOBILE HAMBURGER MENU TOGGLE
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    // Click event to toggle the mobile menu drawer
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle CSS classes
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      
      // Update ARIA accessibility state for screen readers
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking any navigation link (Essential for mobile UX)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          menuToggle.classList.remove('active');
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside of the header area
    document.addEventListener('click', (event) => {
      const isClickInside = menuToggle.contains(event.target) || navMenu.contains(event.target);
      if (!isClickInside && navMenu.classList.contains('open')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER SCROLL EFFECT
  // Adds extra background darkening when the page is scrolled down.
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(7, 8, 14, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.backgroundColor = 'rgba(7, 8, 14, 0.85)';
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. SCROLL SPY: ACTIVE NAV LINK HIGHLIGHTING
  // Uses IntersectionObserver to highlight current visible section in navbar.
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Triggers when section enters upper viewport
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. CONTACT FORM VALIDATION & INTERACTIVE TRANSMISSION
  // Handles client-side form validation and gives clear user feedback.
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userMessageInput = document.getElementById('userMessage');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Simple Email Regex Pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload

      let isValid = true;

      // Clear previous error messages
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      // Validate Full Name (Minimum 2 characters)
      const nameValue = userNameInput.value.trim();
      if (!nameValue) {
        nameError.textContent = 'Please enter your commander/player name.';
        isValid = false;
      } else if (nameValue.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters long.';
        isValid = false;
      }

      // Validate Email
      const emailValue = userEmailInput.value.trim();
      if (!emailValue) {
        emailError.textContent = 'Please provide an email address for transmission.';
        isValid = false;
      } else if (!emailPattern.test(emailValue)) {
        emailError.textContent = 'Please enter a valid email format (e.g., name@domain.com).';
        isValid = false;
      }

      // Validate Message (Minimum 10 characters)
      const messageValue = userMessageInput.value.trim();
      if (!messageValue) {
        messageError.textContent = 'Please provide details about your squad or inquiry.';
        isValid = false;
      } else if (messageValue.length < 10) {
        messageError.textContent = 'Message must be at least 10 characters long.';
        isValid = false;
      }

      // If all fields are valid, simulate network transmission
      if (isValid) {
        // Disable button to prevent duplicate submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING SIGNAL...';

        setTimeout(() => {
          // Success Response
          formFeedback.classList.add('success');
          formFeedback.textContent = `Transmission received, Commander ${nameValue}! Our ARENA X tournament division will contact ${emailValue} shortly.`;
          
          // Reset form fields
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT MESSAGE';

          // Hide success message after 7 seconds
          setTimeout(() => {
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = '';
          }, 7000);
        }, 800);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. TOURNAMENT SQUAD REGISTRATION MODAL / FEEDBACK
  // Replaces default browser alerts with smooth animated notifications.
  // --------------------------------------------------------------------------
  const registerButtons = document.querySelectorAll('.tourney-card .btn');

  registerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.tourney-card');
      const tourneyTitle = card ? card.querySelector('.tourney-title').textContent : 'Tournament';
      
      // Custom interactive feedback banner
      showNotification(`🎮 Registration Portal: Welcome to ${tourneyTitle}! Registration request queued for official verification.`);
    });
  });

  // Reusable Floating Toast Notification Function
  function showNotification(message) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.arena-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'arena-toast';
    toast.textContent = message;

    // Toast styling via JavaScript
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      maxWidth: '380px',
      background: 'rgba(9, 13, 27, 0.95)',
      color: '#00f2fe',
      border: '1px solid #00f2fe',
      borderRadius: '8px',
      padding: '16px 20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 242, 254, 0.3)',
      backdropFilter: 'blur(10px)',
      zIndex: '9999',
      transition: 'all 0.3s ease',
      transform: 'translateY(100px)',
      opacity: '0'
    });

    document.body.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  console.log('ARENA X – Esports Arena core modules initialized.');
});
