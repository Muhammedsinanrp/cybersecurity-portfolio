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
  initProjectTester();
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
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
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
  const themes = ['', 'theme-anime-hacker', 'theme-blackhat', 'theme-emerald', 'theme-crimson'];
  let currentThemeIdx = 0;
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      document.body.className = themes[currentThemeIdx];
      const names = ['Cyan Cyber Command', 'Anime Cyber Mecha (Edgerunners)', 'Black Hat Hacker Overdrive', 'Emerald Matrix', 'Crimson Threat Defense'];
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

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          navLinks.style.display = 'none';
        }
      });
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

/* ==========================================================================
   11. Selected SOC Project Telemetry Simulator & Modal Logic
   ========================================================================== */
window.closeTelemetryModal = function() {
  const modal = document.getElementById('project-telemetry-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.runProjectTelemetrySim = function(projectId) {
  const modal = document.getElementById('project-telemetry-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const terminalTitle = document.getElementById('modal-terminal-title');
  const hudStats = document.getElementById('modal-hud-stats');
  const output = document.getElementById('modal-terminal-output');
  const githubLink = document.getElementById('modal-github-link');

  if (!modal || !output) return;

  if (window.cyberSound) window.cyberSound.playRadarPing();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Loading state
  output.innerHTML = '<div class="terminal-sim-loader"><i class="fas fa-spinner fa-spin"></i> Establishing secure telemetry stream & parsing raw PCAP / SIEM logs...</div>';

  setTimeout(() => {
    if (window.cyberSound) window.cyberSound.playAccessGranted();

    switch (projectId) {
      case 'wazuh':
        modalTitle.textContent = 'NETWORK THREAT DETECTION LAB (WAZUH + SNORT + WIRESHARK)';
        terminalTitle.textContent = 'WAZUH SIEM TELEMETRY STREAM & SNORT IDS ALERTS';
        githubLink.href = 'https://github.com/Muhammedsinanrp/Network-Threat-Detection-Lab';
        hudStats.innerHTML = `
          <div class="m-stat"><span class="m-lbl">TOTAL ALERTS</span><span class="m-val text-cyan">642</span></div>
          <div class="m-stat"><span class="m-lbl">IDS ENGINE</span><span class="m-val text-green">Snort 3.1</span></div>
          <div class="m-stat"><span class="m-lbl">MITRE ATT&CK</span><span class="m-val text-amber">T1110 / T1071.004</span></div>
          <div class="m-stat"><span class="m-lbl">SEVERITY</span><span class="m-val text-red">CRITICAL (Level 12)</span></div>
        `;
        output.innerHTML = `
<pre class="telemetry-log">
<span class="log-cyan">[WAZUH-MANAGER-ALERT]</span> rule.id: 5716 | level: 12 | desc: "Multiple SSH/RDP failed logins followed by success"
<span class="log-dim">Timestamp: 2026-09-22T08:14:32.402+0000 | Agent: ubuntu-soc-endpoint (001)</span>
{
  "timestamp": "2026-09-22T08:14:32Z",
  "rule": { "id": "100201", "level": 12, "description": "Snort IDS Alert: High Rate TCP SYN Scan Detected", "mitre": ["T1046", "T1110"] },
  "agent": { "id": "001", "name": "srv-windows-2022", "ip": "192.168.10.15" },
  "data": {
    "src_ip": "192.168.10.42",
    "dst_ip": "192.168.10.15",
    "dst_port": 3389,
    "proto": "TCP",
    "snort_rule": "alert tcp any any -> $HOME_NET 3389 (msg:\\"ET SCAN Potential RDP Brute Force\\"; flags:S; threshold:type both, track by_src, count 20, seconds 60; sid:2001214;)"
  }
}

<span class="log-green">[+] Snort Rule Triggered:</span> sid:2001214 -> 42 repeated SYN packets observed to port 3389 in 12.4s
<span class="log-green">[+] Wireshark Stream Analysis:</span> PCAP capture confirmed Nmap NSE script "rdp-enum-encryption" signature
<span class="log-green">[+] SOC Triage Action:</span> Null-routed 192.168.10.42 at perimeter gateway; incident ticket INC-4920 closed with remediation verified.
</pre>`;
        break;

      case 'splunk':
        modalTitle.textContent = 'SOC HOME LAB — SPLUNK SIEM & ATTACK DETECTION';
        terminalTitle.textContent = 'SPLUNK ENTERPRISE SPL SEARCH DISPATCH & TELEMETRY';
        githubLink.href = 'https://github.com/Muhammedsinanrp/SOC-Home-Lab';
        hudStats.innerHTML = `
          <div class="m-stat"><span class="m-lbl">FORWARDER</span><span class="m-val text-cyan">Universal 9.1</span></div>
          <div class="m-stat"><span class="m-lbl">EVENT CODE</span><span class="m-val text-green">4625 / 4672</span></div>
          <div class="m-stat"><span class="m-lbl">DETECTION</span><span class="m-val text-amber">Brute Force & PrivEsc</span></div>
          <div class="m-stat"><span class="m-lbl">RUNBOOK</span><span class="m-val text-red">Active AD Triage</span></div>
        `;
        output.innerHTML = `
<pre class="telemetry-log">
<span class="log-cyan">[SPLUNK SPL QUERY DISPATCH]</span>
index=wineventlog EventCode=4625 
| stats count by TargetUserName, WorkstationName, IpAddress 
| where count > 15 
| eval ThreatLevel=if(count > 50, "CRITICAL", "HIGH")
| sort -count

<span class="log-dim">Matching Events: 84 | Query Execution Time: 0.18s</span>
------------------------------------------------------------------------------------------
| TargetUserName       | WorkstationName | IpAddress       | count | ThreatLevel |
------------------------------------------------------------------------------------------
| Administrator        | KALI-ATTACK     | 10.0.0.105      | 68    | CRITICAL    |
| svc-backup           | WORKSTATION-04  | 10.0.0.112      | 24    | HIGH        |
| jdoe                 | HR-LAPTOP-02    | 10.0.0.189      | 16    | HIGH        |
------------------------------------------------------------------------------------------

<span class="log-green">[+] Incident Response Runbook Executed:</span> IR-WIN-042 (Account Lockout & Host Isolation)
<span class="log-green">[+] Splunk Dashboard Alert:</span> Triggered automated webhook to SOC analyst queue.
<span class="log-green">[+] Attacker Artifacts:</span> Process lineage identified cmd.exe spawning Mimikatz memory read attempt.
</pre>`;
        break;

      case 'elk':
        modalTitle.textContent = 'ENTERPRISE WINDOWS LOG ANALYSIS & THREAT INVESTIGATION';
        terminalTitle.textContent = 'ELASTIC SIEM EQL/KQL INVESTIGATION & SIGMA DETECTIONS';
        githubLink.href = 'https://github.com/Muhammedsinanrp/Enterprise-ELK-SIEM';
        hudStats.innerHTML = `
          <div class="m-stat"><span class="m-lbl">CORRELATION</span><span class="m-val text-cyan">Splunk + ELK</span></div>
          <div class="m-stat"><span class="m-lbl">RULE FORMAT</span><span class="m-val text-green">Sigma Standard</span></div>
          <div class="m-stat"><span class="m-lbl">LOGON TYPE</span><span class="m-val text-amber">Type 10 (RemoteInteractive)</span></div>
          <div class="m-stat"><span class="m-lbl">STATUS</span><span class="m-val text-red">CONTAINED</span></div>
        `;
        output.innerHTML = `
<pre class="telemetry-log">
<span class="log-cyan">[SIGMA RULE EVALUATION]</span> rules/windows/builtin/security/win_rdp_bruteforce.yml
title: RDP Brute Force Followed by Successful Logon
status: production
references: ['https://attack.mitre.org/techniques/T1110/']

<span class="log-cyan">[ELASTIC SIEM EQL QUERY]</span>
sequence by winlog.computer_name with maxspan=2m
  [authentication where winlog.event_id == 4625 and winlog.logon_type == 10] with runs >= 5
  [authentication where winlog.event_id == 4624 and winlog.logon_type == 10]

<span class="log-dim">Correlated 1 Host Match: DC-PROD-01.domain.local (192.168.1.10)</span>
<span class="log-green">[✓] Event ID 4625:</span> 38 failed logon attempts within 45 seconds targeting user "DomainAdmin".
<span class="log-green">[✓] Event ID 4624:</span> Successful logon achieved at 08:14:45 UTC.
<span class="log-green">[✓] Event ID 4672:</span> Special privileges assigned to new logon session (SeDebugPrivilege, SeTcbPrivilege).
<span class="log-green">[✓] SOC Remediation:</span> Revoked compromised session token, forced enterprise-wide Kerberos ticket reset (krbtgt).
</pre>`;
        break;

      case 'sniffer':
        modalTitle.textContent = 'PYTHON PACKET SNIFFER — DEEP PACKET INSPECTION';
        terminalTitle.textContent = 'SCAPY REAL-TIME PACKET ENGINE & ANOMALY DETECTOR';
        githubLink.href = 'https://github.com/Muhammedsinanrp/Packet-Sniffer';
        hudStats.innerHTML = `
          <div class="m-stat"><span class="m-lbl">ENGINE</span><span class="m-val text-cyan">Python 3 / Scapy</span></div>
          <div class="m-stat"><span class="m-lbl">PACKETS/SEC</span><span class="m-val text-green">1,840 pps</span></div>
          <div class="m-stat"><span class="m-lbl">ANOMALIES</span><span class="m-val text-amber">TCP Port Sweep</span></div>
          <div class="m-stat"><span class="m-lbl">SOCKET</span><span class="m-val text-red">AF_PACKET Raw</span></div>
        `;
        output.innerHTML = `
<pre class="telemetry-log">
<span class="log-cyan">[PYTHON SCAPY PACKET CAPTURE INITIALIZED]</span> Interface: eth0 | Filter: "ip and (tcp or udp)"
Capturing raw frames across data link layer...

<span class="log-dim">[FRAME 001]</span> IP: 192.168.1.105:44321 -> 192.168.1.1:80 | TTL: 64 | Proto: TCP [SYN] | Win: 1024
<span class="log-dim">[FRAME 002]</span> IP: 192.168.1.105:44322 -> 192.168.1.1:22 | TTL: 64 | Proto: TCP [SYN] | Win: 1024
<span class="log-dim">[FRAME 003]</span> IP: 192.168.1.105:44323 -> 192.168.1.1:443 | TTL: 64 | Proto: TCP [SYN] | Win: 1024
<span class="log-dim">[FRAME 004]</span> IP: 192.168.1.105:44324 -> 192.168.1.1:3389 | TTL: 64 | Proto: TCP [SYN] | Win: 1024

<span class="log-amber">[!] ANOMALY DETECTED:</span> Rapid sequential port connection sequence from 192.168.1.105 (Nmap Stealth SYN Scan signature).
<span class="log-green">[+] TCP Window Size Anomaly:</span> Fixed window size (1024) indicates automated scanning tool rather than legitimate browser.
<span class="log-green">[+] Heuristic Engine:</span> Anomaly score: 96/100 -> Flagged IP added to real-time banlist.
<span class="log-green">[+] Output Exported:</span> Session PCAP written to /logs/capture_20260922_threat.pcap for forensic review.
</pre>`;
        break;
    }
  }, 600);
};

/* ==========================================================================
   12. Interactive SOC Project Tester & Playground Engine
   ========================================================================== */
function initProjectTester() {
  const projBtns = document.querySelectorAll('.tester-proj-btn');
  const attackBtns = document.querySelectorAll('.attack-vector-btn');
  const execBtn = document.getElementById('btn-execute-tester-attack');
  const consoleBody = document.getElementById('tester-console-body');
  const repoBtn = document.getElementById('tester-view-repo-btn');

  // Metrics
  const targetLabMetric = document.getElementById('metric-target-lab');
  const mitreMetric = document.getElementById('metric-mitre-id');
  const latencyMetric = document.getElementById('metric-latency');
  const statusMetric = document.getElementById('metric-status');

  // Phases
  const phase1 = document.getElementById('phase-1');
  const phase2 = document.getElementById('phase-2');
  const phase3 = document.getElementById('phase-3');
  const phase4 = document.getElementById('phase-4');

  if (!execBtn || !consoleBody) return;

  let currentProject = 'wazuh';
  let currentAttack = 'nmap_syn';
  let isSimulating = false;

  const projectRepos = {
    wazuh: 'https://github.com/Muhammedsinanrp/Network-Threat-Detection-Lab',
    splunk: 'https://github.com/Muhammedsinanrp/SOC-Home-Lab',
    elk: 'https://github.com/Muhammedsinanrp/Enterprise-ELK-SIEM',
    sniffer: 'https://github.com/Muhammedsinanrp/Packet-Sniffer'
  };

  const projectNames = {
    wazuh: 'Wazuh SIEM + Snort IDS Lab',
    splunk: 'Splunk Enterprise SOC Lab',
    elk: 'Windows Log Analysis (ELK + Sigma)',
    sniffer: 'Python Packet Sniffer (Scapy DPI)'
  };

  const attackMitreMap = {
    nmap_syn: 'T1046 (Network Service Discovery)',
    rdp_brute: 'T1110.001 (Password Spraying: RDP)',
    dns_c2: 'T1071.004 (Application Layer Protocol: DNS C2)',
    mimikatz: 'T1003.001 (OS Credential Dumping: LSASS)',
    kerberoasting: 'T1558.003 (Steal/Forge Kerberos: Kerberoasting)'
  };

  // Project selector click
  projBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProject = btn.getAttribute('data-project');

      if (targetLabMetric) targetLabMetric.textContent = projectNames[currentProject] || currentProject;
      if (repoBtn) repoBtn.href = projectRepos[currentProject] || '#';
      if (window.cyberSound) window.cyberSound.playHover();
      showToast(`🎯 Target Security Lab: ${projectNames[currentProject]}`);
    });
  });

  // Attack selector click
  attackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      attackBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAttack = btn.getAttribute('data-attack');

      if (mitreMetric) mitreMetric.textContent = attackMitreMap[currentAttack] || currentAttack;
      if (window.cyberSound) window.cyberSound.playHover();
    });
  });

  // Execute attack simulation
  execBtn.addEventListener('click', () => {
    if (isSimulating) return;
    isSimulating = true;
    execBtn.disabled = true;

    // Reset phase UI
    [phase1, phase2, phase3, phase4].forEach(p => {
      if (p) p.className = 'phase-step';
    });

    if (statusMetric) {
      statusMetric.innerHTML = '<span style="color:#ffb703;"><i class="fas fa-spinner fa-spin"></i> ATTACK INJECTED...</span>';
    }
    if (latencyMetric) latencyMetric.textContent = 'Measuring...';

    if (window.cyberSound) window.cyberSound.playRadarPing();
    consoleBody.innerHTML = `<div class="tester-log-row"><span class="log-amber">[STAGE 1: ADVERSARY INJECTION]</span> Transmitting payload <span class="log-cyan">${currentAttack.toUpperCase()}</span> against <span class="log-cyan">${projectNames[currentProject]}</span>...</div>`;

    // Step 1: Inject
    if (phase1) phase1.classList.add('active');

    // Step 2: Detect (Snort / IDS / Scapy)
    setTimeout(() => {
      if (phase1) { phase1.classList.remove('active'); phase1.classList.add('completed'); }
      if (phase2) phase2.classList.add('active');

      let idsOutput = '';
      if (currentProject === 'sniffer') {
        idsOutput = `<span class="log-cyan">[SCAPY-RAW-SNIFFER]</span> Flagged TCP header anomaly. Packet flags [SYN=1, ACK=0] Window: 1024 -> Signature matches automated scanner.`;
      } else {
        idsOutput = `<span class="log-cyan">[SNORT-3-IDS]</span> RULE TRIGGERED: alert tcp any any -> 192.168.10.15 (sid:${Math.floor(2000000 + Math.random()*90000)}; rev:1; msg:"Adversary signature detected - ${currentAttack.toUpperCase()}");`;
      }

      consoleBody.innerHTML += `<div class="tester-log-row">${idsOutput}</div>`;
      consoleBody.scrollTop = consoleBody.scrollHeight;
      if (window.cyberSound) window.cyberSound.playKeypress();
    }, 550);

    // Step 3: Correlate (SIEM / SPL / EQL)
    setTimeout(() => {
      if (phase2) { phase2.classList.remove('active'); phase2.classList.add('completed'); }
      if (phase3) phase3.classList.add('active');

      let siemOutput = '';
      if (currentProject === 'splunk') {
        siemOutput = `<span class="log-green">[SPLUNK-DETECTION-ENGINE]</span> Correlation Search Matched: 42 events aggregated in 30s. Triggered High-Priority Alert "Adversary Triage: ${currentAttack}".`;
      } else if (currentProject === 'elk') {
        siemOutput = `<span class="log-green">[ELASTIC-SIEM-EQL]</span> Sequence rule matched logon event threshold. Sigma rule "win_${currentAttack}" evaluated true across 2 domain hosts.`;
      } else if (currentProject === 'sniffer') {
        siemOutput = `<span class="log-green">[PYTHON-HEURISTIC-PIPELINE]</span> Analyzed 1,480 packets in 0.18s. Port entropy calculation exceeded baseline threshold (Z-Score: +4.2).`;
      } else {
        siemOutput = `<span class="log-green">[WAZUH-SIEM-ANALYSIS]</span> Normalized event to MITRE ATT&CK ${attackMitreMap[currentAttack]}. Rule Level: 12 (High Threat Incident Generated).`;
      }

      consoleBody.innerHTML += `<div class="tester-log-row">${siemOutput}</div>`;
      consoleBody.scrollTop = consoleBody.scrollHeight;
      if (window.cyberSound) window.cyberSound.playKeypress();
    }, 1100);

    // Step 4: Contain & Complete
    setTimeout(() => {
      if (phase3) { phase3.classList.remove('active'); phase3.classList.add('completed'); }
      if (phase4) { phase4.classList.add('active', 'completed'); }

      const latencyMs = (Math.random() * 0.12 + 0.12).toFixed(2);
      if (latencyMetric) latencyMetric.textContent = `${latencyMs}s`;
      if (statusMetric) statusMetric.innerHTML = '<span class="status-blocked">BLOCKED & MITIGATED [✓]</span>';

      consoleBody.innerHTML += `
<div class="tester-log-row" style="margin-top:8px; border-top:1px dashed rgba(0,255,102,0.3); padding-top:8px;">
<span class="log-green">[+] AUTOMATED INCIDENT RESPONSE:</span> Host firewall drop rule applied. Attacker IP null-routed. Forensic PCAP session dumped to SOC archive.
<br><span style="color:#00ff66; font-weight:700;">[✓] THREAT NEUTRALIZED BY MUHAMMED SINAN'S DETECTION ARCHITECTURE.</span>
</div>`;
      consoleBody.scrollTop = consoleBody.scrollHeight;

      if (window.cyberSound) window.cyberSound.playAccessGranted();
      showToast(`🛡️ Threat Blocked: ${currentAttack.toUpperCase()} neutralized in ${latencyMs}s!`);

      isSimulating = false;
      execBtn.disabled = false;
    }, 1700);
  });
}
