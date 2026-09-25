/**
 * STACKLY COMPLIANCE & SERVICES - DASHBOARD SCRIPTS & ANALYTICS
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  initSidebarAndTopbar();
  initSidebarHeadingSync();
  initDashboardLogoBehavior();
  initSignOut();

  // Initialize specific charts based on current dashboard page or canvas presence
  renderActiveDashboardCharts();

  // Re-render charts on window resize / orientation change with debounce
  let chartResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(chartResizeTimer);
    chartResizeTimer = setTimeout(() => {
      renderActiveDashboardCharts();
    }, 150);
  });

  // Initialize Shuffle & Arrange transition for the 4 stat cards
  initStatCardsShuffle();

  // Initialize alternating scroll-triggered left/right animation for 4 analytical sections
  initSectionsScrollAnimation();
});

function renderActiveDashboardCharts() {
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  if (currentPath === 'dashboard.html' || document.getElementById('compliancePieChartCanvas')) {
    renderDashboard1Charts();
  }
  if (currentPath === 'compliance-dashboard.html') {
    renderDashboard2Charts();
  }
  if (currentPath === 'regulatory-tracking.html' || document.getElementById('regPieChartCanvas')) {
    renderRegulatoryTrackingCharts();
  }
  if (currentPath === 'risk-matrix.html' || document.getElementById('riskPieChartCanvas')) {
    renderRiskMatrixCharts();
  }
  if (currentPath === 'performance-metrics.html' || document.getElementById('perfPieChartCanvas')) {
    renderPerformanceMetricsCharts();
  }
  if (currentPath === 'audit-summaries.html' || document.getElementById('auditBarChartCanvas')) {
    renderAuditSummariesCharts();
  }
}

/* --------------------------------------------------------------------------
   1. DYNAMIC USER PROFILE POPULATION
   -------------------------------------------------------------------------- */
function initUserProfile() {
  let storedUser = null;
  try {
    const raw = localStorage.getItem('stackly_user') || sessionStorage.getItem('stackly_user');
    if (raw) storedUser = JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored user', e);
  }

  // Check URL parameters for explicit role override (e.g. ?role=manager or ?role=officer)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');

  const isManagerDash = window.location.pathname.includes('compliance-dashboard.html');
  const isOfficerDash = window.location.pathname.includes('dashboard.html') && !isManagerDash;

  let currentRole = 'Compliance Officer';
  if (paramRole === 'manager' || paramRole === 'Compliance Manager' || isManagerDash) {
    currentRole = 'Compliance Manager';
  } else if (paramRole === 'officer' || paramRole === 'Compliance Officer' || isOfficerDash) {
    currentRole = 'Compliance Officer';
  } else if (storedUser && storedUser.role) {
    currentRole = storedUser.role;
  }

  const defaultName = currentRole === 'Compliance Manager' ? 'Sathya' : 'Alexander Wright';
  const defaultEmail = currentRole === 'Compliance Manager' ? 'sathya.compliance@gmail.com' : 'alexander.wright@stackly.io';

  const userData = {
    name: (storedUser && storedUser.name) || defaultName,
    email: (storedUser && storedUser.email) || defaultEmail,
    role: currentRole
  };

  // Persist updated role in storage so all subpages seamlessly preserve it
  try {
    localStorage.setItem('stackly_user', JSON.stringify(userData));
    sessionStorage.setItem('stackly_user', JSON.stringify(userData));
  } catch(e) {}

  // 1. "Welcome, [User Name]" in hero banner
  const welcomeNameElements = document.querySelectorAll('.dynamic-user-name');
  welcomeNameElements.forEach(el => {
    el.textContent = userData.name;
  });

  // 2. Topbar Profile Trigger
  const topbarName = document.getElementById('topbarUserName');
  if (topbarName) topbarName.textContent = userData.name;

  const avatarCircle = document.getElementById('profileAvatarLetter');
  if (avatarCircle && userData.name) {
    avatarCircle.textContent = userData.name.trim().charAt(0).toUpperCase();
  }

  // 3. Profile Panel Dropdown details
  const profileDetailName = document.getElementById('profileDetailName');
  const profileDetailEmail = document.getElementById('profileDetailEmail');
  const profileDetailRole = document.getElementById('profileDetailRole');

  if (profileDetailName) profileDetailName.textContent = userData.name;
  if (profileDetailEmail) profileDetailEmail.textContent = userData.email;
  if (profileDetailRole) profileDetailRole.textContent = userData.role;

  // If logged-in user is a Compliance Manager, adapt sidebar navigation and headings across all dashboard pages
  if (userData.role === 'Compliance Manager') {
    adaptSidebarForManager();
  }
}

/* --------------------------------------------------------------------------
   ADAPT SIDEBAR HEADINGS FOR COMPLIANCE MANAGER (ACROSS ALL PAGES)
   -------------------------------------------------------------------------- */
function adaptSidebarForManager() {
  const sidebarList = document.querySelector('.sidebar-menu-list');
  if (!sidebarList) return;

  const currentPath = window.location.pathname.split('/').pop() || 'compliance-dashboard.html';
  
  const managerNavItems = [
    {
      heading: 'Operations Overview',
      href: 'compliance-dashboard.html',
      icon: 'dashboard',
      matchPages: ['compliance-dashboard.html']
    },
    {
      heading: 'Departmental Allocation',
      href: 'regulatory-tracking.html',
      icon: 'donut_large',
      matchPages: ['regulatory-tracking.html']
    },
    {
      heading: 'Operational Risk Triage',
      href: 'risk-matrix.html',
      icon: 'leaderboard',
      matchPages: ['risk-matrix.html']
    },
    {
      heading: 'Workflow Throughput',
      href: 'performance-metrics.html',
      icon: 'timeline',
      matchPages: ['performance-metrics.html']
    },
    {
      heading: 'Remediation Pipeline',
      href: 'audit-summaries.html',
      icon: 'account_tree',
      matchPages: ['audit-summaries.html']
    }
  ];

  let itemsHtml = '';
  managerNavItems.forEach(item => {
    const isActive = item.matchPages.includes(currentPath);
    itemsHtml += `
      <li class="sidebar-menu-item ${isActive ? 'active' : ''}" data-heading="${item.heading}">
        <a href="${item.href}">
          <span class="material-icons">${item.icon}</span>
          <span>${item.heading}</span>
        </a>
      </li>
    `;
  });

  sidebarList.innerHTML = itemsHtml;

  // Update sidebar brand link to point to compliance-dashboard.html for Compliance Manager
  const sidebarBrand = document.querySelector('.sidebar-brand');
  if (sidebarBrand) {
    sidebarBrand.setAttribute('href', 'compliance-dashboard.html');
    sidebarBrand.setAttribute('title', 'Navigate to Operations Overview');
  }

  // Update topbar heading to match the current manager heading
  const currentItem = managerNavItems.find(item => item.matchPages.includes(currentPath));
  if (currentItem) {
    const headingTitleEl = document.querySelector('.page-current-heading');
    if (headingTitleEl) {
      headingTitleEl.textContent = currentItem.heading;
    }
    document.title = `${currentItem.heading} | Stackly Platform`;
  }
}

/* --------------------------------------------------------------------------
   2. SIDEBAR, TOPBAR & PROFILE POPOVER
   -------------------------------------------------------------------------- */
function initSidebarAndTopbar() {
  const profileTrigger = document.getElementById('profileDropdownTrigger');
  const profilePanel = document.getElementById('profileDropdownPanel');
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const sidebarClose = document.getElementById('sidebarCloseBtn');
  const sidebar = document.getElementById('dashSidebar');

  // Profile Popover Toggle
  if (profileTrigger && profilePanel) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePanel.classList.toggle('open');
      profileTrigger.classList.toggle('active');
    });

    profilePanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!profilePanel.contains(e.target) && !profileTrigger.contains(e.target)) {
        profilePanel.classList.remove('open');
        profileTrigger.classList.remove('active');
      }
    });
  }

  // Mobile Sidebar Toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-locked', isOpen);
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      document.body.classList.remove('sidebar-locked');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
      sidebar.classList.remove('mobile-open');
      document.body.classList.remove('sidebar-locked');
    }
  });
}

/* --------------------------------------------------------------------------
   3. SIDEBAR HEADING SYNC WITH TOPBAR NAVBAR
   -------------------------------------------------------------------------- */
function initSidebarHeadingSync() {
  const headingTitleEl = document.querySelector('.page-current-heading');
  const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
  const sidebar = document.getElementById('dashSidebar');
  const isManagerDash = window.location.pathname.includes('compliance-dashboard.html');

  // Check URL hash on load (e.g. #compRiskMatrixSection)
  const currentHash = window.location.hash;
  if (isManagerDash && currentHash) {
    const targetId = currentHash.replace('#', '');
    const matchingItem = document.querySelector(`.sidebar-menu-item[data-target="${targetId}"]`);
    if (matchingItem) {
      sidebarItems.forEach(i => i.classList.remove('active'));
      matchingItem.classList.add('active');
      const heading = matchingItem.getAttribute('data-heading');
      if (headingTitleEl && heading) {
        headingTitleEl.textContent = heading;
      }
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  } else {
    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const requestedHeading = urlParams.get('heading');

    if (requestedHeading) {
      if (headingTitleEl) headingTitleEl.textContent = requestedHeading;
      sidebarItems.forEach(item => {
        if (item.getAttribute('data-heading') === requestedHeading) {
          sidebarItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          const targetId = item.getAttribute('data-target');
          if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }
          }
        }
      });
    } else {
      // Initial sync with active sidebar item
      const activeItem = document.querySelector('.sidebar-menu-item.active');
      if (activeItem && headingTitleEl) {
        const activeHeading = activeItem.getAttribute('data-heading') || activeItem.querySelector('span:not(.material-icons)')?.textContent?.trim();
        if (activeHeading) {
          headingTitleEl.textContent = activeHeading;
        }
      }
    }
  }

  let isScrollingProgrammatically = false;

  // Click listener for all sidebar menu items
  sidebarItems.forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;

    link.addEventListener('click', (e) => {
      const headingName = item.getAttribute('data-heading') || link.querySelector('span:not(.material-icons)')?.textContent?.trim();
      const href = link.getAttribute('href');

      // Internal in-page anchor navigation
      if (href && href.startsWith('#')) {
        e.preventDefault();
        isScrollingProgrammatically = true;

        // 1. Instantly display heading at the dashboard navbar
        if (headingTitleEl && headingName) {
          headingTitleEl.textContent = headingName;
        }

        // 2. Set active state
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // 3. Smooth scroll to section
        const targetId = item.getAttribute('data-target') || href.substring(1);
        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        // 4. Close mobile sidebar
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          document.body.classList.remove('sidebar-locked');
        }

        setTimeout(() => {
          isScrollingProgrammatically = false;
        }, 900);
      }
    });
  });

  // Close mobile sidebar when clicking any sidebar item link
  document.querySelectorAll('.sidebar-menu-list a').forEach(link => {
    link.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-locked');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. STACKLY LOGO BEHAVIOR ON DASHBOARDS
   -------------------------------------------------------------------------- */
function initDashboardLogoBehavior() {
  const logoLinks = document.querySelectorAll('.dash-brand-logo-action');
  logoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let storedUser = null;
      try {
        storedUser = JSON.parse(localStorage.getItem('stackly_user') || sessionStorage.getItem('stackly_user'));
      } catch(e) {}
      const isManager = (storedUser && storedUser.role === 'Compliance Manager') || window.location.pathname.includes('compliance-dashboard.html');

      if (isManager) {
        if (window.location.pathname.endsWith('compliance-dashboard.html')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.href = 'compliance-dashboard.html';
        }
      } else {
        if (window.location.pathname.endsWith('dashboard.html')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.href = 'dashboard.html';
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. SIGN OUT BEHAVIOR
   -------------------------------------------------------------------------- */
function initSignOut() {
  const signoutBtns = document.querySelectorAll('.btn-signout, .action-signout');
  signoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_user');
      sessionStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    });
  });
}

/* --------------------------------------------------------------------------
   5. DASHBOARD 1 CHARTS RENDERING (dashboard.html)
   -------------------------------------------------------------------------- */
function renderDashboard1Charts() {
  // SECTION 1: Pie / Donut Chart - Compliance Distribution
  renderDonutChart('compliancePieChartCanvas', [
    { label: 'Compliant', value: 68, color: '#059669' },
    { label: 'Under Review', value: 18, color: '#d97706' },
    { label: 'Pending', value: 8, color: '#6366f1' },
    { label: 'Non-Compliant', value: 6, color: '#dc2626' }
  ]);

  // SECTION 2: Line / Area Graph - Monthly Compliance Performance
  renderAreaGraph('performanceLineChartCanvas', {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [72, 75, 78, 82, 80, 85, 88, 86, 91, 93, 95, 98]
  });

  // SECTION 3: Bar Chart - Risk & Compliance Metrics
  renderBarChart('riskMetricsBarChartCanvas', {
    labels: ['SOX', 'GDPR', 'AML', 'ISO 27001', 'HIPAA'],
    data: [88, 94, 91, 96, 85]
  });
}

/* --------------------------------------------------------------------------
   6. DASHBOARD 2 CHARTS RENDERING (compliance-dashboard.html)
   -------------------------------------------------------------------------- */
function renderDashboard2Charts() {
  // SECTION 1: Donut Chart - Departmental Operational Allocation
  renderDonutChart('auditPieChartCanvas', [
    { label: 'Control Monitoring', value: 40, color: '#1a56db' },
    { label: 'Evidence Collection', value: 30, color: '#38bdf8' },
    { label: 'Policy Enforcement', value: 18, color: '#d97706' },
    { label: 'Remediation Auditing', value: 12, color: '#059669' }
  ]);

  // SECTION 2: Bar Chart - Operational Risk Triage by Unit
  renderBarChart('deptRiskBarChartCanvas', {
    labels: ['Core IT', 'Treasury', 'Regulatory Ops', 'Infrastructure', 'Client Support'],
    data: [78, 92, 84, 70, 64]
  });

  // SECTION 3: Multi-line Graph - Operational Workflow Throughput
  renderTrendGraph('trendLineChartCanvas', {
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6', 'Sprint 7', 'Sprint 8'],
    series1: [45, 52, 60, 68, 75, 82, 88, 94], // Controls Assigned
    series2: [40, 48, 55, 64, 72, 79, 85, 92]  // Controls Completed
  });
}

/* --------------------------------------------------------------------------
   7. REGULATORY TRACKING CHARTS (regulatory-tracking.html)
   -------------------------------------------------------------------------- */
function renderRegulatoryTrackingCharts() {
  renderDonutChart('regPieChartCanvas', [
    { label: 'ISO 27001', value: 32, color: '#1a56db' },
    { label: 'SOC 2 Type II', value: 28, color: '#38bdf8' },
    { label: 'GDPR / Privacy', value: 22, color: '#059669' },
    { label: 'HIPAA', value: 18, color: '#d97706' }
  ]);

  renderBarChart('regBarChartCanvas', {
    labels: ['SOX 404', 'ISO 27001', 'SOC 2', 'GDPR', 'HIPAA', 'NIST CSF'],
    data: [94, 98, 96, 92, 89, 95]
  });

  renderAreaGraph('regLineChartCanvas', {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [78, 80, 84, 87, 86, 90, 92, 91, 95, 96, 97, 99]
  });
}

/* --------------------------------------------------------------------------
   8. RISK MATRIX CHARTS (risk-matrix.html)
   -------------------------------------------------------------------------- */
function renderRiskMatrixCharts() {
  renderDonutChart('riskPieChartCanvas', [
    { label: 'Low Risk', value: 54, color: '#059669' },
    { label: 'Medium Risk', value: 32, color: '#3b82f6' },
    { label: 'Elevated', value: 10, color: '#d97706' },
    { label: 'High Risk', value: 4, color: '#dc2626' }
  ]);

  renderBarChart('riskDeptBarChartCanvas', {
    labels: ['Cloud / IT', 'Finance', 'Legal & Gov', 'Operations', 'People / HR'],
    data: [78, 62, 54, 48, 36]
  });

  renderAreaGraph('riskLineChartCanvas', {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [34, 30, 28, 25, 24, 21, 19, 17, 16, 15, 14, 12]
  });
}

/* --------------------------------------------------------------------------
   9. PERFORMANCE METRICS CHARTS (performance-metrics.html)
   -------------------------------------------------------------------------- */
function renderPerformanceMetricsCharts() {
  renderDonutChart('perfPieChartCanvas', [
    { label: 'Exceeding SLA', value: 62, color: '#059669' },
    { label: 'Meeting SLA', value: 31, color: '#2563eb' },
    { label: 'Under Review', value: 7, color: '#d97706' }
  ]);

  renderBarChart('perfBarChartCanvas', {
    labels: ['Governance', 'Cybersecurity', 'Legal & Tax', 'People Ops', 'Vendor Mgmt'],
    data: [98, 95, 92, 89, 94]
  });

  renderTrendGraph('perfLineChartCanvas', {
    labels: ['Q1 Jan', 'Q1 Feb', 'Q1 Mar', 'Q2 Apr', 'Q2 May', 'Q2 Jun', 'Q3 Jul', 'Q3 Aug'],
    series1: [70, 75, 80, 84, 88, 91, 95, 98],
    series2: [62, 68, 74, 80, 85, 89, 92, 97]
  });
}

/* --------------------------------------------------------------------------
   10. AUDIT SUMMARIES CHARTS (audit-summaries.html)
   -------------------------------------------------------------------------- */
function renderAuditSummariesCharts() {
  renderDonutChart('auditPieChartCanvas', [
    { label: 'Closed / Passed', value: 74, color: '#059669' },
    { label: 'In Remediation', value: 16, color: '#2563eb' },
    { label: 'Evidence Review', value: 10, color: '#d97706' }
  ]);

  renderBarChart('auditBarChartCanvas', {
    labels: ['Cloud Infra', 'Apps', 'Data Gov', 'FinTech', 'Vendors'],
    data: [96, 92, 88, 94, 85]
  });

  renderAreaGraph('auditLineChartCanvas', {
    labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26'],
    data: [82, 84, 86, 89, 91, 94, 96, 98]
  });
}

/* --------------------------------------------------------------------------
   CHART DRAWING UTILITIES (Vanilla Canvas with HiDPI support)
   -------------------------------------------------------------------------- */

// Helper: compute responsive bounds safely constrained within parent and viewport
function getResponsiveCanvasDims(canvas, defaultH = 230) {
  const parent = canvas.parentElement;
  let parentW = parent ? parent.clientWidth : 0;
  if (parent) {
    const style = window.getComputedStyle(parent);
    const pLeft = parseFloat(style.paddingLeft) || 0;
    const pRight = parseFloat(style.paddingRight) || 0;
    if (parentW > (pLeft + pRight)) {
      parentW = parentW - pLeft - pRight;
    }
  }

  const winW = window.innerWidth || 360;
  const maxAvailable = winW > 0 ? (winW - 56) : 320;
  const targetW = parentW > 40 ? Math.min(parentW, maxAvailable) : (canvas.clientWidth || 320);
  const width = Math.max(260, Math.floor(targetW));

  // Determine height reliably - NEVER read canvas.clientHeight directly to prevent shrinking feedback loops
  const isMobile = width < 480;
  const height = isMobile ? 210 : (defaultH || 230);

  return { width, height, isMobile };
}

// Label abbreviation map for mobile views to prevent text overlap
const LABEL_ABBREVIATIONS = {
  'Cloud / IT': 'Cloud',
  'Finance': 'Fin',
  'Legal & Gov': 'Legal',
  'Legal & Governance': 'Legal',
  'Operations': 'Ops',
  'People / HR': 'HR',
  'Cybersecurity': 'Cyber',
  'Governance': 'Gov',
  'Regulatory': 'Reg',
  'Financial': 'Fin',
  'Data Privacy': 'Privacy',
  'Internal Audit': 'Audit',
  'External Audit': 'Ext Aud',
  'IT Security': 'Security',
  'SOC 2 Type II': 'SOC 2',
  'ISO 27001': 'ISO',
  'HIPAA': 'HIPAA',
  'GDPR': 'GDPR',
  'SOX 404': 'SOX',
  'NIST CSF': 'NIST',
  'Legal & Tax': 'Legal',
  'People Ops': 'HR',
  'Vendor Mgmt': 'Vendor',
  'Cloud Infra': 'Cloud',
  'Apps': 'Apps',
  'Data Gov': 'Data',
  'FinTech': 'Fin',
  'Vendors': 'Vendors'
};

function formatBarLabel(rawLabel, isMobile) {
  if (!isMobile) return rawLabel;
  if (LABEL_ABBREVIATIONS[rawLabel]) return LABEL_ABBREVIATIONS[rawLabel];
  if (rawLabel.length > 7) return rawLabel.substring(0, 6) + '.';
  return rawLabel;
}

// 1. Donut / Pie Chart
function renderDonutChart(canvasId, dataset) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement;
  const parentW = parent ? parent.clientWidth : 0;

  // Well-proportioned donut diameter leaving plenty of room for legend
  let width = 160;
  if (parentW >= 560) {
    width = 170;
  } else if (parentW >= 380) {
    width = 150;
  } else if (parentW > 0) {
    width = Math.min(140, Math.max(120, Math.floor(parentW * 0.44)));
  }
  const height = width;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.flexShrink = '0';
  ctx.scale(dpr, dpr);

  const total = dataset.reduce((acc, cur) => acc + cur.value, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) - 7;
  const innerRadius = outerRadius * 0.62;

  let currentAngle = -0.5 * Math.PI;

  dataset.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Dynamic font sizing based on diameter
  const scoreFontSize = Math.max(15, Math.round(width * 0.115));
  const labelFontSize = Math.max(8.5, Math.round(width * 0.055));

  // Inner center text
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold ${scoreFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('94%', centerX, centerY - Math.round(scoreFontSize * 0.32));

  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${labelFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('STATUS SCORE', centerX, centerY + Math.round(labelFontSize * 1.3));
}

// 2. Area / Line Graph
function renderAreaGraph(canvasId, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const { width, height, isMobile } = getResponsiveCanvasDims(canvas, 230);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  const paddingLeft = isMobile ? 38 : 46;
  const paddingRight = isMobile ? 20 : 26;
  const paddingTop = 25;
  const paddingBottom = 35;
  const graphWidth = Math.max(160, width - paddingLeft - paddingRight);
  const graphHeight = Math.max(120, height - paddingTop - paddingBottom);

  // Determine min and max scale cleanly
  const dataMin = Math.min(...chartData.data);
  const isLowScale = dataMin < 35;
  const minVal = chartData.min !== undefined ? chartData.min : (isLowScale ? 0 : 40);
  const maxVal = chartData.max !== undefined ? chartData.max : (isLowScale ? 40 : 100);
  const stepVal = (maxVal - minVal) / 4;

  // Background grid lines
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (graphHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    // Y Axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = isMobile ? '10px "Plus Jakarta Sans", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    const labelNum = Math.round(maxVal - i * stepVal);
    ctx.fillText(`${labelNum}%`, paddingLeft - 8, y + 4);
  }

  const stepX = graphWidth / (chartData.labels.length - 1);

  const points = chartData.data.map((val, idx) => {
    const clampedVal = Math.max(minVal, Math.min(maxVal, val));
    const x = paddingLeft + idx * stepX;
    const y = paddingTop + graphHeight - ((clampedVal - minVal) / (maxVal - minVal)) * graphHeight;
    return { x, y, val };
  });

  // Area Fill
  const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + graphHeight);
  gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
  gradient.addColorStop(1, 'rgba(37, 99, 235, 0.02)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, paddingTop + graphHeight);
  ctx.lineTo(points[0].x, paddingTop + graphHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Stroke Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#1a56db';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots & X Labels
  const totalLabels = chartData.labels.length;
  points.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a56db';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    let showLabel = true;
    if (isMobile) {
      showLabel = (i % 3 === 0 || i === totalLabels - 1);
    } else if (width < 560 && totalLabels > 8) {
      showLabel = (i % 2 === 0 || i === totalLabels - 1);
    }

    if (showLabel) {
      ctx.fillStyle = '#64748b';
      ctx.font = isMobile ? '10px "Plus Jakarta Sans", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(chartData.labels[i], pt.x, height - 10);
    }
  });
}

// 3. Bar Chart
function renderBarChart(canvasId, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const { width, height, isMobile } = getResponsiveCanvasDims(canvas, 230);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  const paddingLeft = isMobile ? 38 : 46;
  const paddingRight = isMobile ? 18 : 24;
  const paddingTop = 25;
  const paddingBottom = 35;
  const graphWidth = Math.max(160, width - paddingLeft - paddingRight);
  const graphHeight = Math.max(120, height - paddingTop - paddingBottom);

  // Grid
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (graphHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = isMobile ? '10px "Plus Jakarta Sans", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${100 - i * 25}%`, paddingLeft - 8, y + 4);
  }

  const numBars = chartData.labels.length;
  const slotWidth = graphWidth / numBars;
  const barWidth = Math.min(isMobile ? 24 : 38, slotWidth * (isMobile ? 0.62 : 0.55));

  chartData.data.forEach((val, idx) => {
    const barHeight = (val / 100) * graphHeight;
    const x = paddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
    const y = paddingTop + graphHeight - barHeight;

    const barGrad = ctx.createLinearGradient(0, y, 0, y + barHeight);
    barGrad.addColorStop(0, '#2563eb');
    barGrad.addColorStop(1, '#1d4ed8');

    // Rounded top bar
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    } else {
      ctx.rect(x, y, barWidth, barHeight);
    }
    ctx.fill();

    // Value label above bar
    ctx.fillStyle = '#0f172a';
    ctx.font = isMobile ? 'bold 10px "Plus Jakarta Sans", sans-serif' : 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${val}%`, x + barWidth / 2, y - 6);

    // X Axis label - abbreviated and formatted on mobile to avoid overlap
    ctx.fillStyle = '#64748b';
    ctx.font = isMobile ? '600 9.5px "Plus Jakarta Sans", sans-serif' : '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const displayLabel = formatBarLabel(chartData.labels[idx], isMobile);
    ctx.fillText(displayLabel, x + barWidth / 2, height - 10);
  });
}

// 4. Multi-Line Trend Graph
function renderTrendGraph(canvasId, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const { width, height, isMobile } = getResponsiveCanvasDims(canvas, 230);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  const paddingLeft = isMobile ? 38 : 46;
  const paddingRight = isMobile ? 18 : 24;
  const paddingTop = 25;
  const paddingBottom = 35;
  const graphWidth = Math.max(160, width - paddingLeft - paddingRight);
  const graphHeight = Math.max(120, height - paddingTop - paddingBottom);

  // Grid
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (graphHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = isMobile ? '10px "Plus Jakarta Sans", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${100 - i * 20}%`, paddingLeft - 8, y + 4);
  }

  const stepX = graphWidth / (chartData.labels.length - 1);
  const minVal = 40;
  const maxVal = 100;

  function drawSeries(seriesData, strokeColor) {
    const pts = seriesData.map((val, idx) => ({
      x: paddingLeft + idx * stepX,
      y: paddingTop + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight
    }));

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    pts.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  drawSeries(chartData.series1, '#1a56db');
  drawSeries(chartData.series2, '#059669');

  // X labels
  chartData.labels.forEach((lbl, idx) => {
    if (isMobile && chartData.labels.length > 5 && idx % 2 !== 0 && idx !== chartData.labels.length - 1) {
      return;
    }
    const displayLbl = isMobile ? lbl.replace(/^Q[1-4]\s*/i, '') : lbl;
    ctx.fillStyle = '#64748b';
    ctx.font = isMobile ? '9.5px "Plus Jakarta Sans", sans-serif' : '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(displayLbl, paddingLeft + idx * stepX, height - 10);
  });
}

/* --------------------------------------------------------------------------
   8. SHUFFLE & ARRANGE TRANSITION FOR 4 STAT CARDS
   Changes card positions, crosses them in a dynamic shuffle, then cleanly
   arranges them into their canonical right positions with celebratory pulse.
   -------------------------------------------------------------------------- */
function initStatCardsShuffle() {
  const statsRows = document.querySelectorAll('.dash-stats-row');
  if (!statsRows || statsRows.length === 0) return;

  statsRows.forEach((statsRow) => {
    const cards = Array.from(statsRow.querySelectorAll('.dash-stat-widget'));
    if (cards.length < 4) return;

    let isShuffling = false;

    // Attach click listener to each card for interactive play
    cards.forEach((card) => {
      card.setAttribute('title', 'Click to shuffle and arrange cards');
      card.addEventListener('click', () => {
        if (!isShuffling) runShuffleAndArrangeSequence();
      });
    });

    // Attach click listener to shuffle button if present
    const shuffleBtn = document.getElementById('btnShuffleCards');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isShuffling) runShuffleAndArrangeSequence();
      });
    }

    function runShuffleAndArrangeSequence() {
      if (isShuffling) return;
      isShuffling = true;

      if (shuffleBtn) {
        const icon = shuffleBtn.querySelector('.material-icons');
        const textSpan = shuffleBtn.querySelector('span:not(.material-icons)');
        if (icon) icon.classList.add('spinning');
        if (textSpan) textSpan.textContent = 'Shuffling...';
      }

      // Record baseline bounding coordinates before displacement
      const initialRects = cards.map(c => c.getBoundingClientRect());

      // Prepare cards for animation
      cards.forEach(card => {
        card.classList.remove('arranged-pulse');
        card.classList.remove('shuffle-arranging');
        card.classList.add('shuffle-lifting');
      });

      // PHASE 1: Scramble positions (cards change their positions!)
      // Permutation 1: Card 0 -> Pos 2, Card 1 -> Pos 3, Card 2 -> Pos 0, Card 3 -> Pos 1
      const perm1 = [2, 3, 0, 1];
      const tilts1 = [3.5, -3.0, 2.5, -3.5];
      const zIndices1 = [12, 14, 11, 13];

      cards.forEach((card, i) => {
        const targetIdx = perm1[i];
        const dx = initialRects[targetIdx].left - initialRects[i].left;
        const dy = initialRects[targetIdx].top - initialRects[i].top;
        card.style.zIndex = zIndices1[i];
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilts1[i]}deg) scale(1.05)`;
      });

      // PHASE 2: Cross-flutter / secondary shuffle at 650ms
      setTimeout(() => {
        // Permutation 2: Card 0 -> Pos 3, Card 1 -> Pos 0, Card 2 -> Pos 1, Card 3 -> Pos 2
        const perm2 = [3, 0, 1, 2];
        const tilts2 = [-2.2, 2.8, -2.5, 2.0];
        const zIndices2 = [13, 11, 14, 12];

        cards.forEach((card, i) => {
          const targetIdx = perm2[i];
          const dx = initialRects[targetIdx].left - initialRects[i].left;
          const dy = initialRects[targetIdx].top - initialRects[i].top;
          card.style.zIndex = zIndices2[i];
          card.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilts2[i]}deg) scale(1.04)`;
        });
      }, 650);

      // PHASE 3: Arrange into right positions at 1250ms ("then arrange in the right position")
      setTimeout(() => {
        if (shuffleBtn) {
          const textSpan = shuffleBtn.querySelector('span:not(.material-icons)');
          if (textSpan) textSpan.textContent = 'Arranging...';
        }

        cards.forEach(card => {
          card.classList.remove('shuffle-lifting');
          card.classList.add('shuffle-arranging');
          card.style.zIndex = '5';
          // Exact return to canonical position (0, 0)
          card.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
        });
      }, 1250);

      // PHASE 4: Settle & Celebration Pulse at 2000ms
      setTimeout(() => {
        cards.forEach((card, i) => {
          card.classList.remove('shuffle-arranging');
          card.style.zIndex = '';
          card.style.transform = '';

          // Staggered celebration pulse across cards: 1 -> 2 -> 3 -> 4
          setTimeout(() => {
            card.classList.add('arranged-pulse');
            setTimeout(() => card.classList.remove('arranged-pulse'), 900);
          }, i * 90);
        });

        if (shuffleBtn) {
          const icon = shuffleBtn.querySelector('.material-icons');
          const textSpan = shuffleBtn.querySelector('span:not(.material-icons)');
          if (icon) {
            icon.classList.remove('spinning');
            icon.textContent = 'check_circle';
          }
          if (textSpan) textSpan.textContent = 'Arranged!';

          setTimeout(() => {
            if (icon) icon.textContent = 'shuffle';
            if (textSpan) textSpan.textContent = 'Shuffle & Arrange';
          }, 1400);
        }

        isShuffling = false;
      }, 2000);
    }

    // Auto-trigger on page load after brief delay so user sees initial page render first
    setTimeout(() => {
      runShuffleAndArrangeSequence();
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   9. SCROLL-TRIGGERED ALTERNATING SECTION ANIMATION (SECTIONS 1, 2, 3, 4)
   Section 1: Slides in from LEFT  --> Arranges into position
   Section 2: Slides in from RIGHT --> Arranges into position
   Section 3: Slides in from LEFT  --> Arranges into position
   Section 4: Slides in from RIGHT --> Arranges into position
   -------------------------------------------------------------------------- */
function initSectionsScrollAnimation() {
  const cards = document.querySelectorAll('.analytics-stacked-column .analytic-card');
  if (!cards || cards.length === 0) return;

  cards.forEach((card, index) => {
    // Section 1 & 3 (indices 0 & 2) slide in from Left
    // Section 2 & 4 (indices 1 & 3) slide in from Right
    if (index % 2 === 0) {
      card.classList.add('scroll-slide-left');
    } else {
      card.classList.add('scroll-slide-right');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
          if (entry.target.querySelector('canvas')) {
            renderActiveDashboardCharts();
          }
        }
      });
    }, { 
      threshold: 0.12, 
      rootMargin: '0px 0px -40px 0px' 
    });

    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => {
      card.classList.add('revealed');
      card.classList.add('in-view');
    });
  }
}


