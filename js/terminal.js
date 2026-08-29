/**
 * Interactive Hacker Terminal & Command Console
 * Muhammed Sinan - SOC Analyst & Ethical Hacker
 */

class CyberTerminal {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;
    this.isExecuting = false;

    if (!this.body || !this.input) return;

    this.init();
  }

  init() {
    this.input.addEventListener('keydown', this.handleInput.bind(this));
    
    // Quick cmd button clicks
    document.querySelectorAll('.quick-cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
        }
      });
    });

    // Initial greeting
    this.appendLine('<span style="color:var(--cyber-cyan)">[CYBER-OS v4.2.0-SECURED]</span> Terminal ready. Type <span style="color:var(--cyber-green); font-weight:bold;">help</span> or click quick commands above.');
  }

  handleInput(e) {
    if (window.cyberSound) window.cyberSound.playKeypress();

    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      if (cmd) {
        this.history.push(cmd);
        this.historyIndex = this.history.length;
        this.executeCommand(cmd);
        this.input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex] || '';
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autoComplete();
    }
  }

  autoComplete() {
    const validCmds = ['help', 'whoami', 'skills', 'experience', 'projects', 'certs', 'contact', 'scan', 'matrix', 'clear', 'theme'];
    const current = this.input.value.trim().toLowerCase();
    const match = validCmds.find(c => c.startsWith(current));
    if (match) {
      this.input.value = match;
    }
  }

  appendLine(htmlContent) {
    const row = document.createElement('div');
    row.className = 'terminal-log-row';
    row.innerHTML = htmlContent;
    this.body.appendChild(row);
    this.body.scrollTop = this.body.scrollHeight;
  }

  async executeCommand(rawCmd) {
    if (this.isExecuting) return;
    const parts = rawCmd.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    this.appendLine(`<span class="cmd-prompt">sinan@cybersec:~$</span> <span style="color:#fff;">${this.escapeHtml(rawCmd)}</span>`);

    if (window.cyberSound) window.cyberSound.playHover();

    switch (cmd) {
      case 'help':
      case '?':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">AVAILABLE COMMANDS:</span>
  <span style="color:var(--cyber-green);">whoami</span>       - Display identity & target role
  <span style="color:var(--cyber-green);">summary</span>      - Read professional background & career goal
  <span style="color:var(--cyber-green);">skills</span>       - List core technical arsenal & SIEM tools
  <span style="color:var(--cyber-green);">experience</span>   - View RedTeam Academy, TryHackMe & HTB details
  <span style="color:var(--cyber-green);">projects</span>     - Inspect OSINT, Proxmox HomeLab, Phishing Sims
  <span style="color:var(--cyber-green);">certs</span>        - List CEH, CPT, Deloitte & Tata credentials
  <span style="color:var(--cyber-green);">scan</span>         - Run simulated vulnerability & port scan
  <span style="color:var(--cyber-green);">contact</span>      - Display email, LinkedIn & socials
  <span style="color:var(--cyber-green);">matrix</span>       - Toggle Matrix Rain HUD visualizer
  <span style="color:var(--cyber-green);">theme</span>        - Change theme [cyan | emerald | crimson]
  <span style="color:var(--cyber-green);">clear</span>        - Clear terminal console
        `);
        break;

      case 'whoami':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">Muhammed Sinan</span>
<span style="color:#fff;">Cybersecurity Professional | Ethical Hacker | SOC Analyst</span>
<span style="color:var(--text-muted);">Location: Malappuram, Kerala, India</span>
<span style="color:var(--cyber-green);">Status: Active Threat Hunter / SOC Analyst Candidate</span>
        `);
        break;

      case 'summary':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">[PROFESSIONAL SUMMARY]</span>
SOC Analyst with hands-on experience in SIEM monitoring, threat detection, incident response, vulnerability assessment, log analysis, network security, and security monitoring.

<span style="color:var(--cyber-cyan); font-weight:bold;">[CAREER GOAL]</span>
<span style="color:var(--cyber-green);">Land an entry-level role as a SOC Analyst or Junior Penetration Tester where I can contribute immediately while continuing to grow.</span>
        `);
        break;

      case 'skills':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">CORE TECHNICAL ARSENAL:</span>
- <span style="color:#fff;">SIEM & EDR:</span> Splunk Enterprise, Microsoft Sentinel, ELK Stack, Microsoft Defender for Endpoint
- <span style="color:#fff;">Network & Forensics:</span> Wireshark, TCP/IP Analysis, Packet Inspection, Nmap
- <span style="color:#fff;">Offensive & PenTesting:</span> Kali Linux, Parrot OS, Burp Suite, Metasploit, Impacket, CrackMapExec, BloodHound
- <span style="color:#fff;">Vulnerability Assessment:</span> Nessus, VirusTotal Threat Intel
- <span style="color:#fff;">Scripting & Automation:</span> Python, Bash, PowerShell
        `);
        break;

      case 'experience':
      case 'exp':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">PROFESSIONAL EXPERIENCE & LABS:</span>

1. <span style="color:var(--cyber-green); font-weight:bold;">Cybersecurity Lab Intern - RedTeam Hacker Academy</span>
   • Monitored 50+ SIEM alerts daily & investigated security events.
   • Improved detection accuracy by 25% and reduced MTTD by 35%.
   • Conducted 20+ vulnerability assessments identifying 100+ weaknesses.
   • Automated log analysis with Python & Bash (60% effort reduction).

2. <span style="color:var(--cyber-green); font-weight:bold;">TryHackMe (100+ Labs Completed)</span>
   • SOC Level 1, Blue Team, Incident Response, Active Directory, Threat Hunting, MITRE ATT&CK.

3. <span style="color:var(--cyber-green); font-weight:bold;">Hack The Box</span>
   • Solved Linux & Windows machines: Privilege Escalation, Active Directory Attacks, Web Exploits.
        `);
        break;

      case 'projects':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">HANDS-ON PROJECTS & LABS:</span>
• <span style="color:var(--cyber-green);">OSINT Reconnaissance:</span> Passive info gathering (SpiderFoot, WHOIS) across 10+ targets.
• <span style="color:var(--cyber-green);">Home Lab Development:</span> Virtualized Proxmox cybersecurity lab cluster.
• <span style="color:var(--cyber-green);">Phishing Simulation:</span> MaxPhisher social engineering vectors and defenses.
• <span style="color:var(--cyber-green);">Linux PenTest Labs:</span> Kali & Parrot OS network scanning and hardening.
        `);
        break;

      case 'certs':
      case 'certifications':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">CERTIFICATIONS & CREDENTIALS:</span>
1. <span style="color:var(--cyber-green); font-weight:bold;">Certified Ethical Hacker (CEH)</span> - EC-Council
2. <span style="color:var(--cyber-green); font-weight:bold;">Certified Penetration Tester (CPT)</span> - Red Team Hacker Academy
3. <span style="color:var(--cyber-green); font-weight:bold;">Deloitte Australia</span> - Cyber Job Simulation
4. <span style="color:var(--cyber-green); font-weight:bold;">Tata</span> - Cybersecurity Analyst Job Simulation
5. <span style="color:var(--cyber-green); font-weight:bold;">Bachelor's Degree</span> - University of Calicut (2022 - 2025)
        `);
        break;

      case 'contact':
        this.appendLine(`
<span style="color:var(--cyber-cyan); font-weight:bold;">DIRECT CHANNELS:</span>
• Email: <a href="mailto:sinanshazzrp31@gmail.com" style="color:var(--cyber-green);">sinanshazzrp31@gmail.com</a> / <a href="mailto:wwwsinanrp@gmail.com" style="color:var(--cyber-green);">wwwsinanrp@gmail.com</a>
• LinkedIn: <a href="https://www.linkedin.com/in/muhammedsinan-cybersecurity" target="_blank" style="color:var(--cyber-cyan);">linkedin.com/in/muhammedsinan-cybersecurity</a>
• GitHub: <a href="https://github.com/Muhammedsinanrp" target="_blank" style="color:var(--cyber-cyan);">github.com/Muhammedsinanrp</a>
• Location: Malappuram, Kerala, India
        `);
        break;

      case 'matrix':
        const matrixCanvas = document.getElementById('matrix-canvas');
        if (matrixCanvas) {
          matrixCanvas.classList.toggle('active');
          const isActive = matrixCanvas.classList.contains('active');
          this.appendLine(`Matrix Rain Visualizer: <span style="color:var(--cyber-green); font-weight:bold;">${isActive ? 'ENABLED' : 'DISABLED'}</span>`);
        }
        break;

      case 'theme':
        if (arg === 'emerald') {
          document.body.className = 'theme-emerald';
          this.appendLine('Theme switched to <span style="color:#00ff88;">Emerald Cyber Matrix</span>.');
        } else if (arg === 'crimson') {
          document.body.className = 'theme-crimson';
          this.appendLine('Theme switched to <span style="color:#ff3366;">Crimson Threat Alert</span>.');
        } else {
          document.body.className = '';
          this.appendLine('Theme switched to <span style="color:#00f2fe;">Cyan Cyber Command</span>.');
        }
        break;

      case 'scan':
        this.isExecuting = true;
        this.appendLine('<span style="color:var(--cyber-amber);">[*] Initializing vulnerability & port reconnaissance on local perimeter...</span>');
        
        await this.delay(600);
        this.appendLine('<span style="color:var(--cyber-cyan);">[+] Discovering open services: 22/tcp (SSH), 80/tcp (HTTP), 443/tcp (HTTPS), 8080/tcp (Splunk-Web)</span>');
        if (window.cyberSound) window.cyberSound.playRadarPing();
        
        await this.delay(800);
        this.appendLine('<span style="color:var(--cyber-cyan);">[+] Inspecting SIEM rules & Active Directory security policies...</span>');
        
        await this.delay(700);
        this.appendLine('<span style="color:var(--cyber-green);">[✓] Scan Complete: 0 Critical vulnerabilities detected. Perimeter defended by Muhammed Sinan.</span>');
        if (window.cyberSound) window.cyberSound.playAccessGranted();
        this.isExecuting = false;
        break;

      case 'clear':
      case 'cls':
        this.body.innerHTML = '';
        break;

      case 'sudo':
        this.appendLine('<span style="color:var(--cyber-red);">[!] Incident Reported: User is not in the sudoers file. SOC alert dispatched to Muhammed Sinan.</span>');
        break;

      default:
        this.appendLine(`<span style="color:var(--cyber-red);">Command not found: "${this.escapeHtml(cmd)}". Type <span style="color:var(--cyber-cyan); font-weight:bold;">help</span> for available commands.</span>`);
        break;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
});
