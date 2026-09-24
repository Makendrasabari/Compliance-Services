/**
 * STACKLY COMPLIANCE & SERVICES - MAIN JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyHeader();
  initMobileNavigation();
  initActiveNav();
  initScrollReveal();
  initModals();
  initBlogFilter();
  initContactForm();
  initContactFaq();
  initMapNavigation();
  initCustomDropdowns();
  initHeroBackgroundSlider();
  initLiveCounters();
  initInsightsShuffle();
  initSectionChoreography();
  initCrushOpenImages();
  initMissionVisionShuffle();
  initApproachSection();
  initLeadersMarquee();
  initNewsletterValidation();
});

/* --------------------------------------------------------------------------
   1. UNIQUE PRELOADER (At least 1.5 seconds)
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('sitePreloader');
  if (!preloader) {
    document.body.classList.add('page-loaded');
    return;
  }

  const minDuration = 1600; // 1.6 seconds minimum
  const startTime = Date.now();

  function completePreloader() {
    if (preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');
    document.body.classList.add('page-loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDuration - elapsed);

    setTimeout(() => {
      completePreloader();
    }, remaining);
  });

  // Fallback timer if load event already fired
  setTimeout(() => {
    completePreloader();
  }, 2200);
}

/* --------------------------------------------------------------------------
   2. STICKY HEADER
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const overlay = document.getElementById('mobileMenuOverlay');
  const drawer = document.getElementById('mobileDrawer');

  if (!drawer) return;

  let closeTimer = null;

  function openDrawer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (overlay) {
      overlay.style.display = 'block';
    }
    drawer.style.display = 'flex';

    // Force layout reflow before triggering CSS transitions
    void drawer.offsetWidth;

    drawer.classList.remove('is-closing');
    if (overlay) overlay.classList.remove('is-closing');

    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer(immediate = false) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    if (immediate || window.innerWidth > 992) {
      drawer.classList.remove('is-closing');
      if (overlay) overlay.classList.remove('is-closing');
      drawer.style.display = 'none';
      if (overlay) overlay.style.display = 'none';
      return;
    }

    drawer.classList.add('is-closing');
    if (overlay) overlay.classList.add('is-closing');

    closeTimer = setTimeout(() => {
      drawer.classList.remove('is-closing');
      if (overlay) overlay.classList.remove('is-closing');
      if (!drawer.classList.contains('active')) {
        drawer.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
      }
    }, 280);
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeDrawer();
    });
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any link inside drawer (nav links, login, logo)
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer(true);
    });
  });

  // Handle window resize: automatically close drawer if resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeDrawer(true);
    }
  });

  // Ensure initial closed state on load
  if (!drawer.classList.contains('active')) {
    drawer.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    drawer.setAttribute('aria-hidden', 'true');
  }
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK DETECTION
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATION
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in-up');
  const cardGrids = document.querySelectorAll('.services-catalog-grid, .industry-grid, .process-flow, .services-methodology-grid, .coverage-cards-grid, .blog-grid, .dossier-cards-grid, .radar-milestones-grid, .contact-info-panel, .faq-zigzag-grid');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    // Orchestrated convergence for Institutional Compliance, Strategic Advantage, Process flows, Blog cards, Dossiers, Radars, Contact Channels, and FAQ items
    const gridObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.querySelectorAll('.service-card, .industry-card, .process-step-card, .methodology-card, .coverage-card, .blog-card, .dossier-card, .radar-card, .contact-channel-card, .faq-zigzag-item').forEach(c => c.classList.add('revealed'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cardGrids.forEach(g => gridObserver.observe(g));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
    cardGrids.forEach(g => {
      g.classList.add('revealed');
      g.querySelectorAll('.service-card, .industry-card, .process-step-card, .methodology-card, .coverage-card, .blog-card, .dossier-card, .radar-card, .contact-channel-card, .faq-zigzag-item').forEach(c => c.classList.add('revealed'));
    });
  }
}

/* --------------------------------------------------------------------------
   6. LEARN MORE MODALS FOR SERVICES
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalDetails = document.getElementById('modalServiceDetails');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  const serviceData = {
    'regulatory-compliance': {
      title: 'Regulatory Compliance Services',
      desc: 'End-to-end framework navigation ensuring institutional adherence across complex multi-jurisdictional mandates.',
      points: [
        'Comprehensive gap analysis across federal, regional, and sector rules.',
        'Continuous compliance mapping with automated regulatory intelligence updates.',
        'Regulator audit defense and documentation verification.',
        'Implementation of AML, KYC, and corporate compliance controls.'
      ]
    },
    'risk-management': {
      title: 'Enterprise Risk Management',
      desc: 'Proactive identification, quantification, and mitigation of operational and strategic vulnerabilities.',
      points: [
        'Custom enterprise risk appetite formulation and tolerance matrix.',
        'Quarterly stress testing and scenario analysis for cloud and financial assets.',
        'Third-party and vendor risk oversight workflows.',
        'Real-time incident response escalation protocols.'
      ]
    },
    'internal-audit': {
      title: 'Internal Audit & Advisory',
      desc: 'Independent assessment of internal control systems to safeguard corporate governance integrity.',
      points: [
        'Risk-based internal audit planning and annual charter formulation.',
        'Operational control reviews against COSO and ISO frameworks.',
        'Comprehensive board-ready audit reports with prioritized remediation.',
        'Audit follow-up validation and testing.'
      ]
    },
    'data-privacy': {
      title: 'Data Privacy Compliance',
      desc: 'Global data protection assurance protecting client data pipelines and regulatory standing.',
      points: [
        'Full GDPR, CCPA/CPRA, and cross-border transfer compliance audits.',
        'Data Protection Impact Assessments (DPIA) and data mapping.',
        'Privacy by Design architectural reviews for SaaS products.',
        'Data subject access request (DSAR) automation assistance.'
      ]
    },
    'corporate-compliance': {
      title: 'Corporate Compliance & Ethics',
      desc: 'Building an organizational culture of integrity with transparent accountability mechanisms.',
      points: [
        'Code of Conduct and compliance charter development.',
        'Whistleblower policy and secure reporting intake channels.',
        'Anti-bribery and corruption (FCPA / UK Bribery Act) controls.',
        'Annual corporate compliance certification and executive training.'
      ]
    },
    'policy-governance': {
      title: 'Policy & Governance Architecture',
      desc: 'Modernizing corporate documentation to harmonize with dynamic institutional standards.',
      points: [
        'Centralized policy lifecycle management and review schedules.',
        'Governance operating model design and board committee frameworks.',
        'ESG transparency reporting and regulatory validation.',
        'Policy attestation and workforce compliance tracking.'
      ]
    },
    'compliance-monitoring': {
      title: 'Continuous Compliance Monitoring',
      desc: 'Real-time telemetry and KPI surveillance to prevent control drift and compliance lapses.',
      points: [
        'Automated metric dashboards with threshold breach alerts.',
        'Periodic control effectiveness testing and validation.',
        'Vendor compliance status surveillance.',
        'Predictive compliance health scores.'
      ]
    },
    'security-regulatory': {
      title: 'Security & Regulatory Advisory',
      desc: 'Specialized advisory bridging cyber security controls and institutional regulatory frameworks.',
      points: [
        'SOC 2 Type II and ISO 27001 readiness assessments.',
        'HIPAA, PCI-DSS, and FedRAMP control implementations.',
        'Cyber incident disclosure preparedness under SEC rules.',
        'Penetration test reviews and vulnerability remediation roadmaps.'
      ]
    }
  };

  document.querySelectorAll('[data-service-key]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '404.html') {
        return; // Allow direct navigation to 404.html
      }
      e.preventDefault();
      const key = btn.getAttribute('data-service-key');
      const data = serviceData[key];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;

      modalDetails.innerHTML = '';
      data.points.forEach(pt => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '10px';
        li.style.marginBottom = '10px';
        li.style.fontSize = '0.92rem';
        li.style.color = '#1e293b';
        li.innerHTML = '<span class="material-icons" style="color:#059669;font-size:18px;">check_circle</span>' + pt;
        modalDetails.appendChild(li);
      });

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* --------------------------------------------------------------------------
   7. BLOG CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('[data-blog-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      blogCards.forEach(card => {
        const category = card.getAttribute('data-blog-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM HANDLER
   - Simultaneous inline red validation below each input box (No alerts/popups)
   - Real-time error dismissal on input
   - Direct navigation to 404.html upon valid submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const fields = [
    {
      input: document.getElementById('contactName'),
      error: document.getElementById('contactNameError'),
      validate: (val) => val.trim().length > 0,
      emptyMsg: 'Please enter a name.'
    },
    {
      input: document.getElementById('contactEmail'),
      error: document.getElementById('contactEmailError'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      },
      emptyMsg: 'Please enter an email address.',
      invalidMsg: 'Please enter a valid email address.'
    },
    {
      input: document.getElementById('contactPhone'),
      error: document.getElementById('contactPhoneError'),
      validate: (val) => val.trim().length >= 7,
      emptyMsg: 'Please enter a phone number.',
      invalidMsg: 'Please enter a valid phone number.'
    },
    {
      input: document.getElementById('contactSubject'),
      error: document.getElementById('contactSubjectError'),
      validate: (val) => val.trim().length > 0,
      emptyMsg: 'Please enter a subject.'
    },
    {
      input: document.getElementById('contactMessage'),
      error: document.getElementById('contactMessageError'),
      validate: (val) => val.trim().length > 0,
      emptyMsg: 'Please enter your message details.'
    }
  ];

  // Real-time clearance of errors on user typing
  fields.forEach(f => {
    if (!f.input || !f.error) return;
    f.input.addEventListener('input', () => {
      if (f.input.value.trim().length > 0) {
        f.input.classList.remove('input-error');
        f.error.style.display = 'none';
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;
    let firstInvalidInput = null;

    fields.forEach(f => {
      if (!f.input || !f.error) return;

      const val = f.input.value;
      const isBlank = val.trim().length === 0;

      if (isBlank) {
        f.error.textContent = f.emptyMsg;
        f.error.style.display = 'block';
        f.input.classList.add('input-error');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = f.input;
      } else if (!f.validate(val)) {
        f.error.textContent = f.invalidMsg || f.emptyMsg;
        f.error.style.display = 'block';
        f.input.classList.add('input-error');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = f.input;
      } else {
        f.error.style.display = 'none';
        f.input.classList.remove('input-error');
      }
    });

    if (hasErrors) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // All fields are valid -> Navigate to 404.html
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting Inquiry...</span> <span class="material-icons spin">sync</span>';
    }

    setTimeout(() => {
      window.location.href = '404.html';
    }, 350);
  });
}

/* --------------------------------------------------------------------------
   8b. CONTACT MAP NAVIGATION TO GOOGLE MAPS
   - Clicking on map container or overlay navigates to Google Maps elaborately
   -------------------------------------------------------------------------- */
function initMapNavigation() {
  const mapOverlay = document.getElementById('mapClickOverlay');
  const mapWrapper = document.querySelector('.contact-map-wrapper');
  const googleMapsUrl = 'https://www.google.com/maps/place/100+Wall+St,+New+York,+NY+10005/@40.7055745,-74.0084346,17z';

  function openGoogleMaps(e) {
    if (e) e.preventDefault();
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  }

  if (mapOverlay) {
    mapOverlay.addEventListener('click', openGoogleMaps);
  }
  if (mapWrapper) {
    mapWrapper.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && !e.target.closest('a')) {
        openGoogleMaps(e);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8c. CONTACT PAGE FAQ ACCORDION INTERACTION
   -------------------------------------------------------------------------- */
function initContactFaq() {
  const faqItems = document.querySelectorAll('.faq-zigzag-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other FAQs for smooth accordion flow
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. CUSTOM DROPDOWN COMPONENT (NO NATIVE SELECT)
   -------------------------------------------------------------------------- */
function initCustomDropdowns() {
  const dropdownContainers = document.querySelectorAll('.custom-dropdown-container');

  dropdownContainers.forEach(container => {
    const trigger = container.querySelector('.custom-dropdown-trigger');
    const items = container.querySelectorAll('.custom-dropdown-item');
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const selectedText = trigger.querySelector('.selected-text');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other open dropdowns
      dropdownContainers.forEach(c => {
        if (c !== container) c.classList.remove('open');
      });
      container.classList.toggle('open');
    });

    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        const value = item.getAttribute('data-value');
        const iconName = item.querySelector('.material-icons')?.textContent || '';
        const label = item.textContent.replace(iconName, '').trim();

        if (hiddenInput) hiddenInput.value = value;
        selectedText.innerHTML = (iconName ? `<span class="material-icons">${iconName}</span> ` : '') + label;

        container.classList.remove('open');

        // Dispatch change event
        const changeEvent = new CustomEvent('dropdownChange', { detail: { value, label } });
        container.dispatchEvent(changeEvent);
      });
    });
  });

  document.addEventListener('click', () => {
    dropdownContainers.forEach(container => container.classList.remove('open'));
  });
}

/* --------------------------------------------------------------------------
   10. HERO BACKGROUND SLIDER (5 Images, 2s Interval Continuous Rotation)
   -------------------------------------------------------------------------- */
function initHeroBackgroundSlider() {
  const slides = document.querySelectorAll('#heroBgSlider .hero-slide');
  if (!slides || slides.length < 2) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 2000); // 2 seconds continuous transition
}

/* --------------------------------------------------------------------------
   11. LIVE RUN & STOP COUNTERS FOR STATS BANNER
   -------------------------------------------------------------------------- */
function initLiveCounters() {
  const statsSection = document.querySelector('.stats-banner');
  const counterElements = document.querySelectorAll('.stat-item-number[data-target]');
  if (!counterElements.length) return;

  let hasAnimated = false;

  // Smooth decelerating exponential ease for live-run feel
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function runCounter(el, delay = 0) {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    const useComma = el.getAttribute('data-format') === 'comma' || target >= 1000;
    const duration = 2200; // 2.2s live run duration

    setTimeout(() => {
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const currentVal = eased * target;

        let displayVal;
        if (decimals > 0) {
          displayVal = currentVal.toFixed(decimals);
        } else {
          const rounded = Math.floor(currentVal);
          displayVal = useComma ? rounded.toLocaleString('en-US') : rounded.toString();
        }

        el.textContent = `${prefix}${displayVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Clean stop at exact target
          const finalVal = decimals > 0
            ? target.toFixed(decimals)
            : (useComma ? target.toLocaleString('en-US') : target.toString());
          el.textContent = `${prefix}${finalVal}${suffix}`;
          el.classList.add('counter-stopped');
        }
      }

      requestAnimationFrame(update);
    }, delay);
  }

  const counterGroups = document.querySelectorAll('.stats-banner, .about-stats-row, .split-feature-grid, .coverage-stats-band');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const els = entry.target.querySelectorAll ? entry.target.querySelectorAll('.stat-item-number[data-target]') : [];
          if (els.length) {
            els.forEach((el, idx) => runCounter(el, idx * 90));
          } else if (entry.target.hasAttribute && entry.target.hasAttribute('data-target')) {
            runCounter(entry.target, 0);
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });

    counterGroups.forEach(g => observer.observe(g));
    counterElements.forEach(el => {
      if (!el.closest('.stats-banner') && !el.closest('.about-stats-row') && !el.closest('.split-feature-grid') && !el.closest('.coverage-stats-band')) {
        observer.observe(el);
      }
    });
  } else {
    counterElements.forEach((el, idx) => runCounter(el, idx * 90));
  }
}

/* --------------------------------------------------------------------------
   12. SHUFFLE & ARRANGEMENT ANIMATION FOR LATEST COMPLIANCE INSIGHTS
   -------------------------------------------------------------------------- */
function initInsightsShuffle() {
  const grid = document.getElementById('blogShuffleGrid');
  const section = document.getElementById('insightsSection');
  const reshuffleBtn = document.getElementById('reshuffleInsightsBtn');

  if (!grid) return;

  let hasShuffled = false;
  let isShuffling = false;

  function triggerShuffle() {
    if (isShuffling) return;
    isShuffling = true;

    // Reset classes to allow replay
    grid.classList.remove('is-shuffling', 'shuffle-settled');
    void grid.offsetWidth; // Force DOM reflow

    grid.classList.add('is-shuffling');

    setTimeout(() => {
      grid.classList.remove('is-shuffling');
      grid.classList.add('shuffle-settled');
      isShuffling = false;
    }, 2250); // Matches animation duration
  }

  // Scroll entrance trigger
  if ('IntersectionObserver' in window && section) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasShuffled) {
          hasShuffled = true;
          setTimeout(triggerShuffle, 250);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });
    observer.observe(section);
  } else {
    setTimeout(triggerShuffle, 600);
  }

  // Interactive Re-shuffle button
  if (reshuffleBtn) {
    reshuffleBtn.addEventListener('click', () => {
      triggerShuffle();
    });
  }
}

/* --------------------------------------------------------------------------
   13. SECTION HEADINGS & SUBTITLES CHOREOGRAPHY (All 5 Pages)
   -------------------------------------------------------------------------- */
function initSectionChoreography() {
  // 1. Standard Section Headers: Title bold words from RIGHT (one by one), Subtitle from LEFT
  const sectionHeaders = document.querySelectorAll('.section-header, .choreograph-header');
  sectionHeaders.forEach(header => {
    const title = header.querySelector('.section-title, h2');
    const subtitle = header.querySelector('.section-subtitle, p');

    // Tokenize title words if not already wrapped
    if (title && !title.querySelector('.heading-word-right')) {
      const words = title.textContent.trim().split(/\s+/);
      title.setAttribute('aria-label', title.textContent.trim());
      title.innerHTML = words.map((word, idx) => 
        `<span class="heading-word-right" style="--w-idx: ${idx};">${word}</span>`
      ).join(' ');
    }

    // Mark subtitle
    if (subtitle && !subtitle.classList.contains('subtitle-sentence-left')) {
      subtitle.classList.add('subtitle-sentence-left');
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            header.classList.add('header-in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      });
      observer.observe(header);
    } else {
      header.classList.add('header-in-view');
    }
  });

  // 2. CTA Sections: Title white bold words from LEFT (one by one), Subtitle from RIGHT, Left btn from LEFT, Right btn from RIGHT
  const ctaSections = document.querySelectorAll('.section-dark, .cta-section');
  ctaSections.forEach(cta => {
    // If it is the specialized services CTA section
    if (cta.classList.contains('services-cta-section')) {
      if ('IntersectionObserver' in window) {
        const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              cta.classList.add('cta-in-view');
              ctaObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.08,
          rootMargin: '0px 0px 50px 0px'
        });
        ctaObserver.observe(cta);
      } else {
        cta.classList.add('cta-in-view');
      }
      return;
    }

    const heading = cta.querySelector('.cta-heading, h2');
    const subtitle = cta.querySelector('.cta-sentence-right, p');
    const buttons = cta.querySelectorAll('.btn');

    // Tokenize CTA heading words if not already wrapped
    if (heading && !heading.querySelector('.cta-word-left')) {
      const words = heading.textContent.trim().split(/\s+/);
      heading.setAttribute('aria-label', heading.textContent.trim());
      heading.innerHTML = words.map((word, idx) => 
        `<span class="cta-word-left" style="--cw-idx: ${idx};">${word}</span>`
      ).join(' ');
    }

    // Mark CTA subtitle
    if (subtitle && !subtitle.classList.contains('cta-sentence-right')) {
      subtitle.classList.add('cta-sentence-right');
    }

    // Mark buttons
    if (buttons.length >= 2) {
      buttons[0].classList.add('cta-button-left');
      buttons[1].classList.add('cta-button-right');
    } else if (buttons.length === 1) {
      buttons[0].classList.add('cta-button-left');
    }

    if ('IntersectionObserver' in window) {
      const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cta.classList.add('cta-in-view');
            ctaObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px 50px 0px'
      });
      ctaObserver.observe(cta);
    } else {
      cta.classList.add('cta-in-view');
    }
  });
}

/* --------------------------------------------------------------------------
   14. CRUSH AND OPEN IMAGE ANIMATION
   -------------------------------------------------------------------------- */
function initCrushOpenImages() {
  const crushWrappers = document.querySelectorAll('.crush-open-wrapper, .split-feature-grid');
  if (!crushWrappers.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const frames = entry.target.querySelectorAll('.crush-open-image-frame');
          frames.forEach(frame => frame.classList.add('is-opened'));
          entry.target.classList.add('crush-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -30px 0px'
    });

    crushWrappers.forEach(w => observer.observe(w));
  } else {
    document.querySelectorAll('.crush-open-image-frame').forEach(f => f.classList.add('is-opened'));
  }
}

/* --------------------------------------------------------------------------
   15. MISSION & VISION SHUFFLE & ARRANGEMENT ANIMATION
   -------------------------------------------------------------------------- */
function initMissionVisionShuffle() {
  const grid = document.getElementById('missionVisionGrid');
  if (!grid) return;

  let hasShuffled = false;

  function triggerShuffle() {
    if (grid.classList.contains('is-shuffling')) return;
    grid.classList.remove('is-shuffling', 'shuffle-settled');
    void grid.offsetWidth; // Reflow
    grid.classList.add('is-shuffling');

    setTimeout(() => {
      grid.classList.remove('is-shuffling');
      grid.classList.add('shuffle-settled');
    }, 2250);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasShuffled) {
          hasShuffled = true;
          setTimeout(triggerShuffle, 200);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });
    observer.observe(grid);
  } else {
    setTimeout(triggerShuffle, 500);
  }
}

/* --------------------------------------------------------------------------
   16. DIAGONAL SPLIT & JOINING IMAGES (About & Blog Pages) + DIRECTIONAL CARDS
   -------------------------------------------------------------------------- */
function initApproachSection() {
  const section = document.getElementById('approachSection');
  const cardsList = document.getElementById('approachCardsList');

  // 1. Initialize ALL diagonal split image wraps across the site (About page & Blog featured analysis)
  const diagonalWraps = document.querySelectorAll('.diagonal-split-image-wrap');
  diagonalWraps.forEach(diagonalWrap => {
    // Replay on Click
    diagonalWrap.addEventListener('click', () => {
      diagonalWrap.classList.remove('is-joined');
      void diagonalWrap.offsetWidth;
      requestAnimationFrame(() => {
        diagonalWrap.classList.add('is-joined');
      });
    });

    // Scroll-triggered entrance & diagonal join
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            diagonalWrap.classList.add('is-joined');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      observer.observe(diagonalWrap);
    } else {
      diagonalWrap.classList.add('is-joined');
    }
  });

  // 2. Synchronous trigger for Blog Featured Card
  const featuredBlogCard = document.getElementById('blogFeaturedCard');
  if (featuredBlogCard && 'IntersectionObserver' in window) {
    const blogCardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const wrap = featuredBlogCard.querySelector('.diagonal-split-image-wrap');
          const header = featuredBlogCard.querySelector('.choreograph-header');
          if (wrap) wrap.classList.add('is-joined');
          if (header) header.classList.add('header-in-view');
          blogCardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });
    blogCardObserver.observe(featuredBlogCard);
  }

  // 3. Interactive Click on Cards to Enlighten Icons (About page)
  const approachCards = document.querySelectorAll('.approach-card');
  approachCards.forEach(card => {
    card.addEventListener('click', () => {
      const isEnlightened = card.classList.toggle('is-enlightened');
      card.setAttribute('aria-pressed', isEnlightened ? 'true' : 'false');
    });

    // Keyboard accessibility (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // 4. Approach cards list entrance (About page)
  if (cardsList && 'IntersectionObserver' in window) {
    const cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cardsList.classList.add('cards-in-view');
          cardsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });
    cardsObserver.observe(cardsList);
  } else if (cardsList) {
    cardsList.classList.add('cards-in-view');
  }
}

/* --------------------------------------------------------------------------
   17. EXECUTIVE LEADERSHIP: CONTINUOUS LIVE-RUNNING HORIZONTAL CAROUSEL
   -------------------------------------------------------------------------- */
function initLeadersMarquee() {
  const marquee = document.getElementById('leadersMarquee');
  const track = document.getElementById('leadersTrack');
  const leaderCards = document.querySelectorAll('.leader-card');

  if (!marquee && leaderCards.length === 0) return;

  // Click & Keyboard interactions on Leader Cards
  leaderCards.forEach(card => {
    card.addEventListener('click', () => {
      const isEnlightened = card.classList.toggle('is-enlightened');
      card.setAttribute('aria-pressed', isEnlightened ? 'true' : 'false');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Touch support for mobile: pause when touch starts, resume when touch ends
  if (track) {
    track.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('touchend', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   18. NEWSLETTER DISPATCH FORM VALIDATION
   -------------------------------------------------------------------------- */
function initNewsletterValidation() {
  const form = document.getElementById('newsletterDispatchForm');
  const input = document.getElementById('newsletterEmailInput');
  const errorEl = document.getElementById('newsletterEmailError');

  if (!form || !input || !errorEl) return;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    input.classList.add('input-error');
    input.focus();
  }

  function hideError() {
    errorEl.style.display = 'none';
    input.classList.remove('input-error');
  }

  input.addEventListener('input', () => {
    if (input.value.trim().length > 0) {
      hideError();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();

    if (!val) {
      showError('Please enter an email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      showError('Please enter a valid email address.');
      return;
    }

    // Direct navigation to 404.html without any toast or popup notification
    hideError();
    window.location.href = '404.html';
  });
}


