/**
 * Core Application Logic & Interactive 3D Effects
 * Muhammed Sinan - Cybersecurity Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initGlitchTyping();
  init3DCardTilt();
  initMatrixRain();
  initSOCLogStream();
  initCounterStats();
  initSkillFilters();
  initHUDControls();
  initContactForm();
  initNavScroll();
});

/* ==========================================================================
   1. Custom Cyber Reticle Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .cyber-card, .skill-card, .cert-card, .project-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      if (window.cyberSound) window.cyberSound.playHover();
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   2. Typing Glitch Text Effect
   ========================================================================== */
function initGlitchTyping() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    'SOC Analyst (Tier 1 & 2)',
    'Ethical Hacker & Pentester',
    'SIEM & Threat Detection Specialist',
    'Active Directory & Blue Team Hunter',
    'Cybersecurity Professional'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 85;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      speed = 1800; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. 3D Card Tilt with Dynamic Perspective & Glare
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.cyber-card, .skill-card, .project-card, .cert-card, .timeline-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* ==========================================================================
   4. Matrix Rain Canvas Engine
   ========================================================================== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?/░▒▓█';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(5, 8, 17, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 45);
}

/* ==========================================================================
   5. Live SOC Threat Radar & Log Stream Simulator
   ========================================================================== */
function initSOCLogStream() {
  const streamBox = document.getElementById('soc-stream');
  if (!streamBox) return;

  const mockEvents = [
    { level: 'warn', msg: 'Splunk Alert: Suspicious PowerShell execution (EncodedCommand) on Host-042' },
    { level: 'info', msg: 'Wireshark: TCP SYN flood attempt mitigated at edge firewall' },
    { level: 'crit', msg: 'Sentinel: Brute-force Kerberoasting attempt detected on Domain Controller' },
    { level: 'info', msg: 'Nessus Scan: Patch verification verified for CVE-2024-XXXX' },
    { level: 'warn', msg: 'Defender EDR: Unauthorized LSASS process dump blocked' },
    { level: 'info', msg: 'VirusTotal API: Zero-day hash queried - marked as malicious (Score: 68/72)' },
    { level: 'info', msg: 'TryHackMe SOC Lab: Snort rule triggered on ICMP tunneling' },
    { level: 'warn', msg: 'RedTeam Academy Lab: Active Directory bloodhound query identified' }
  ];

  function addLog() {
    const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    const time = new Date().toTimeString().split(' ')[0];
    
    const row = document.createElement('div');
    row.className = 'log-entry';
    row.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-level-${event.level}">[${event.level.toUpperCase()}]</span>
      <span class="log-msg">${event.msg}</span>
    `;

    streamBox.appendChild(row);
    if (streamBox.children.length > 7) {
      streamBox.removeChild(streamBox.children[0]);
    }
  }

  // Populate initial logs
  for (let i = 0; i < 4; i++) {
    addLog();
  }

  setInterval(addLog, 3200);
}

/* ==========================================================================
   6. Animated Number Counters
   ========================================================================== */
function initCounterStats() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 40;

          function update() {
            count += speed;
            if (count < target) {
              counter.textContent = Math.floor(count) + suffix;
              requestAnimationFrame(update);
            } else {
              counter.textContent = target + suffix;
            }
          }
          update();
        });
      }
    });
  }, { threshold: 0.3 });

  const hud = document.querySelector('.hero-telemetry-hud');
  if (hud) observer.observe(hud);
}

/* ==========================================================================
   7. Skill Category Filter Nav & 3D Mode Switcher
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');
  const galaxyBtn = document.getElementById('mode-3d-galaxy-btn');
  const cardsBtn = document.getElementById('mode-3d-cards-btn');
  const galaxyContainer = document.getElementById('skills-3d-galaxy-container');
  const cardsGrid = document.getElementById('skills-cards-grid');

  // Mode Switcher Listeners
  if (galaxyBtn && cardsBtn && galaxyContainer && cardsGrid) {
    galaxyBtn.addEventListener('click', () => {
      galaxyBtn.classList.add('active');
      cardsBtn.classList.remove('active');
      galaxyContainer.style.display = 'grid';
      cardsGrid.style.display = 'none';
      if (window.cyberSound) window.cyberSound.playChirp();
      showToast('🌌 3D WebGL Arsenal Galaxy: ENGAGED');
    });

    cardsBtn.addEventListener('click', () => {
      cardsBtn.classList.add('active');
      galaxyBtn.classList.remove('active');
      galaxyContainer.style.display = 'none';
      cardsGrid.style.display = 'grid';
      if (window.cyberSound) window.cyberSound.playChirp();
      showToast('🎴 3D Holographic Card Matrix: ACTIVE');
    });
  }

  // Category Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Update 3D Cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInLog 0.4s ease-out';
        } else {
          card.style.display = 'none';
        }
      });

      // Update 3D WebGL Galaxy Nodes
      if (window.skills3D) {
        window.skills3D.filterCategory(filter);
      }

      if (window.cyberSound) window.cyberSound.playHover();
    });
  });
}

/* ==========================================================================
   8. HUD Controls (Sound, Matrix, Theme, Copy)
   ========================================================================== */
function initHUDControls() {
  // Sound FX Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    if (window.cyberSound && window.cyberSound.enabled) {
      soundBtn.classList.add('active');
    }
    soundBtn.addEventListener('click', () => {
      if (window.cyberSound) {
        const isEnabled = window.cyberSound.toggle();
        soundBtn.classList.toggle('active', isEnabled);
        showToast(isEnabled ? '🔊 Audio FX: ENABLED' : '🔇 Audio FX: MUTED');
      }
    });
  }

  // Matrix Rain Toggle
  const matrixBtn = document.getElementById('matrix-toggle-btn');
  const matrixCanvas = document.getElementById('matrix-canvas');
  if (matrixBtn && matrixCanvas) {
    matrixBtn.addEventListener('click', () => {
      matrixCanvas.classList.toggle('active');
      const isActive = matrixCanvas.classList.contains('active');
      matrixBtn.classList.toggle('active', isActive);
      showToast(isActive ? '⚡ Matrix HUD: ACTIVE' : '⚡ Matrix HUD: DEACTIVATED');
    });
  }

  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['', 'theme-emerald', 'theme-crimson'];
  let currentThemeIdx = 0;
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      document.body.className = themes[currentThemeIdx];
      const names = ['Cyan Cyber Command', 'Emerald Matrix', 'Crimson Threat Defense'];
      showToast(`🎨 Theme: ${names[currentThemeIdx]}`);
      if (window.cyberSound) window.cyberSound.playHover();
    });
  }

  // Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`📋 Copied: ${text}`);
          if (window.cyberSound) window.cyberSound.playAccessGranted();
        });
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form & Encrypted Dispatch Simulation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('cyber-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('sender-subject').value.trim() || 'Cybersecurity Opportunity';
    const message = document.getElementById('sender-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please complete all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting & Dispatching...';
    submitBtn.disabled = true;

    if (window.cyberSound) window.cyberSound.playRadarPing();

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Dispatched!';
      if (window.cyberSound) window.cyberSound.playAccessGranted();
      showToast(`🔒 Message encrypted & delivered for ${name}! Opening mailto link...`);

      // Open mailto fallback
      const mailtoLink = `mailto:sinanshazzrp31@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2500);
    }, 1200);
  });
}

/* ==========================================================================
   10. Navigation & Scroll Listener
   ========================================================================== */
function initNavScroll() {
  const header = document.querySelector('.site-header');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(5, 8, 17, 0.95)';
      navLinks.style.padding = '20px';
      navLinks.style.borderBottom = '1px solid var(--border-cyan)';
    });
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'cyber-toast';
  toast.innerHTML = `<i class="fas fa-terminal" style="color:var(--cyber-cyan)"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
