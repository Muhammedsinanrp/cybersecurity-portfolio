/**
 * 3D WebGL Arsenal Galaxy & Interactive Tool Inspector
 * Muhammed Sinan - Cybersecurity Portfolio
 */

class Skills3DGalaxy {
  constructor() {
    this.container = document.getElementById('skills-3d-viewport');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodesGroup = null;
    this.linesGroup = null;
    this.nodes = [];
    this.selectedNode = null;
    this.hoveredNode = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0.002 };

    // Skill Tools Data
    this.toolsData = [
      {
        id: 'splunk',
        name: 'Splunk Enterprise',
        category: 'siem',
        color: 0x00f2fe,
        shape: 'octahedron',
        proficiency: '92%',
        role: 'SIEM & Detection Engineering',
        icon: 'fas fa-chart-line',
        desc: 'Advanced log parsing, correlation searches, threat detection alerts, and SOC dashboard creation.',
        demoType: 'spl',
        sampleCmd: 'index=firewall action=blocked | stats count by src_ip | sort -count',
        features: ['Log Normalization', 'Alert Triage', 'SPL Queries', 'SOC Dashboards']
      },
      {
        id: 'sentinel',
        name: 'Microsoft Sentinel',
        category: 'siem',
        color: 0x0082ff,
        shape: 'icosahedron',
        proficiency: '88%',
        role: 'Cloud-Native SIEM & SOAR',
        icon: 'fab fa-microsoft',
        desc: 'Cloud telemetry ingestion, KQL hunting queries, incident entity mapping, and automated playbooks.',
        demoType: 'kql',
        sampleCmd: 'SecurityAlert | where TimeGenerated > ago(24h) | summarize count() by AlertName, Severity',
        features: ['KQL Queries', 'Cloud Telemetry', 'Logic Apps', 'Entity Mapping']
      },
      {
        id: 'wireshark',
        name: 'Wireshark',
        category: 'network',
        color: 0x00f2fe,
        shape: 'torus',
        proficiency: '94%',
        role: 'Deep Packet Inspection',
        icon: 'fas fa-water',
        desc: 'TCP/IP stream reassembly, protocol anomaly detection, malware beaconing analysis, and network forensics.',
        demoType: 'pcap',
        sampleCmd: 'tcp.flags.syn == 1 and tcp.flags.ack == 0 and tcp.window_size <= 1024',
        features: ['PCAP Analysis', 'TCP Streams', 'Protocol Dissection', 'Anomaly Catching']
      },
      {
        id: 'nessus',
        name: 'Nessus Scanner',
        category: 'vuln',
        color: 0xffb703,
        shape: 'dodecahedron',
        proficiency: '90%',
        role: 'Vulnerability Assessment',
        icon: 'fas fa-bug',
        desc: 'Credentialed & uncredentialed network vulnerability scanning, CVE risk prioritization, and hardening audits.',
        demoType: 'vuln',
        sampleCmd: 'nessuscli scan --policy="Full Network Audit" --target="192.168.1.0/24"',
        features: ['CVE Prioritization', 'Misconfig Audits', 'Compliance Scans', 'Remediation Plans']
      },
      {
        id: 'defender',
        name: 'Defender for Endpoint',
        category: 'siem',
        color: 0x00ff88,
        shape: 'box',
        proficiency: '86%',
        role: 'EDR & Threat Hunting',
        icon: 'fas fa-shield-virus',
        desc: 'Endpoint detection & response, behavioral analysis, live response investigation, and automated host isolation.',
        demoType: 'edr',
        sampleCmd: 'DeviceProcessEvents | where FileName in~ ("cmd.exe", "powershell.exe") and ProcessCommandLine has "bypass"',
        features: ['Live Response', 'Device Isolation', 'Process Lineage', 'Behavioral Defense']
      },
      {
        id: 'virustotal',
        name: 'VirusTotal Intelligence',
        category: 'vuln',
        color: 0x4facfe,
        shape: 'octahedron',
        proficiency: '91%',
        role: 'Threat Intelligence',
        icon: 'fas fa-virus',
        desc: 'Multi-engine hash correlation, IOC enrichment, sandbox behavioral execution reports, and threat graphs.',
        demoType: 'intel',
        sampleCmd: 'vt file 8f4e2d... --format json | jq .data.attributes.last_analysis_stats',
        features: ['IOC Enrichment', 'Sandbox Reports', 'Graph Analysis', 'API Automation']
      },
      {
        id: 'kali',
        name: 'Kali & Parrot Linux',
        category: 'offensive',
        color: 0x9d4edd,
        shape: 'icosahedron',
        proficiency: '95%',
        role: 'Penetration Testing OS',
        icon: 'fab fa-linux',
        desc: 'Offensive security operations, privilege escalation, network reconnaissance, and custom security tooling.',
        demoType: 'cli',
        sampleCmd: 'nmap -sC -sV -p- -T4 -oN initial_scan.txt 10.10.11.42',
        features: ['Reconnaissance', 'Privilege Escalation', 'Tool Orchestration', 'Linux Hardening']
      },
      {
        id: 'python',
        name: 'Python Automation',
        category: 'scripting',
        color: 0xffb703,
        shape: 'torus',
        proficiency: '85%',
        role: 'Security Tooling & Scripts',
        icon: 'fab fa-python',
        desc: 'Custom port scanners, log parsing automation, API integration with SIEM/VT, and rapid exploit prototyping.',
        demoType: 'py',
        sampleCmd: 'import socket\ndef scan(ip, port): s=socket.socket(); return s.connect_ex((ip, port))==0',
        features: ['Log Parser Automation', 'Socket Tools', 'REST API Ingestion', 'Automated Triage']
      },
      {
        id: 'osint',
        name: 'OSINT & Reconnaissance',
        category: 'offensive',
        color: 0x00f2fe,
        shape: 'dodecahedron',
        proficiency: '88%',
        role: 'Intelligence Gathering',
        icon: 'fas fa-eye',
        desc: 'Passive footprinting, WHOIS intelligence, DNS harvesting, and threat surface mapping across simulated targets.',
        demoType: 'osint',
        sampleCmd: 'spiderfoot -s example.com -m sfp_whois,sfp_dns,sfp_shodan',
        features: ['SpiderFoot', 'WHOIS Recon', 'DNS Enumeration', 'Attack Surface Mapping']
      },
      {
        id: 'ad_tools',
        name: 'Active Directory Attacks',
        category: 'offensive',
        color: 0xff3366,
        shape: 'box',
        proficiency: '87%',
        role: 'Red Team Exploitation',
        icon: 'fas fa-network-wired',
        desc: 'BloodHound domain graph enumeration, Impacket secretsdump, CrackMapExec, and Kerberoasting attacks.',
        demoType: 'ad',
        sampleCmd: 'impacket-secretsdump -just-dc domain/admin@192.168.10.10',
        features: ['BloodHound Analysis', 'Impacket Suite', 'Kerberoasting', 'Privilege Paths']
      },
      {
        id: 'bash',
        name: 'Bash & PowerShell',
        category: 'scripting',
        color: 0x00ff88,
        shape: 'octahedron',
        proficiency: '86%',
        role: 'CLI & Forensics Scripting',
        icon: 'fas fa-terminal',
        desc: 'Windows Event Log investigation via Get-WinEvent, Linux auditd logs parsing, and incident response triage scripts.',
        demoType: 'ps',
        sampleCmd: 'Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625} | Select-Object -First 10',
        features: ['EventLog Queries', 'Triage Scripts', 'Auditd Analysis', 'Automation']
      },
      {
        id: 'network_sec',
        name: 'Network & Firewalls',
        category: 'network',
        color: 0x4facfe,
        shape: 'torus',
        proficiency: '90%',
        role: 'Perimeter Defense & TCP/IP',
        icon: 'fas fa-server',
        desc: 'TCP/IP stack fundamentals, IDS/IPS alerting with Snort, firewall rulesets, and subnet segmentation.',
        demoType: 'net',
        sampleCmd: 'iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set',
        features: ['TCP/IP Stack', 'Snort Rules', 'Firewall ACLs', 'VLAN Segmentation']
      }
    ];

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      setTimeout(() => this.init(), 150);
      return;
    }

    const width = this.container.clientWidth || 800;
    const height = 480;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 18;

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2);
    dirLight1.position.set(10, 15, 10);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00ff88, 1.5);
    dirLight2.position.set(-10, -10, 10);
    this.scene.add(dirLight2);

    // 4. Groups
    this.nodesGroup = new THREE.Group();
    this.linesGroup = new THREE.Group();
    this.scene.add(this.linesGroup);
    this.scene.add(this.nodesGroup);

    // 5. Build 3D Nodes in a Cyber Spherical Array
    this.buildNodes();
    this.buildConnectionLines();
    this.buildCentralHoloOrb();

    // 6. Interaction Listeners
    this.setupInteractions();

    // 7. Render Loop
    this.animate();

    // Open first node by default in Inspector
    this.openInspector(this.toolsData[0]);
  }

  buildCentralHoloOrb() {
    const orbGeo = new THREE.SphereGeometry(2.4, 20, 20);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    this.nodesGroup.add(orb);
  }

  buildNodes() {
    const total = this.toolsData.length;
    const radius = 7.2;

    this.toolsData.forEach((tool, idx) => {
      // Golden Spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * idx) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const nodeMesh = this.createNodeGeometry(tool);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { tool: tool, basePos: { x, y, z }, origColor: tool.color };

      // Outer Glowing Ring for each node
      const ringGeo = new THREE.RingGeometry(0.85, 0.95, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: tool.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      nodeMesh.add(ring);
      nodeMesh.userData.ring = ring;

      this.nodes.push(nodeMesh);
      this.nodesGroup.add(nodeMesh);
    });
  }

  createNodeGeometry(tool) {
    let geo;
    switch (tool.shape) {
      case 'icosahedron':
        geo = new THREE.IcosahedronGeometry(0.7, 1);
        break;
      case 'dodecahedron':
        geo = new THREE.DodecahedronGeometry(0.65, 0);
        break;
      case 'torus':
        geo = new THREE.TorusGeometry(0.5, 0.2, 12, 24);
        break;
      case 'box':
        geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        break;
      default:
        geo = new THREE.OctahedronGeometry(0.7, 0);
        break;
    }

    const mat = new THREE.MeshStandardMaterial({
      color: tool.color,
      wireframe: true,
      emissive: tool.color,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.8
    });

    return new THREE.Mesh(geo, mat);
  }

  buildConnectionLines() {
    this.linesGroup.clear();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.15
    });

    // Connect nodes sharing category or related workflow
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const toolA = this.nodes[i].userData.tool;
        const toolB = this.nodes[j].userData.tool;

        if (toolA.category === toolB.category || Math.random() < 0.2) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            this.nodes[i].position,
            this.nodes[j].position
          ]);
          const line = new THREE.Line(geometry, lineMat);
          this.linesGroup.add(line);
        }
      }
    }
  }

  setupInteractions() {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;

        this.rotationVelocity.y = deltaX * 0.005;
        this.rotationVelocity.x = deltaY * 0.005;

        this.nodesGroup.rotation.y += this.rotationVelocity.y;
        this.nodesGroup.rotation.x += this.rotationVelocity.x;
        this.linesGroup.rotation.y = this.nodesGroup.rotation.y;
        this.linesGroup.rotation.x = this.nodesGroup.rotation.x;

        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevMousePos.x;
        const deltaY = e.touches[0].clientY - this.prevMousePos.y;

        this.nodesGroup.rotation.y += deltaX * 0.006;
        this.nodesGroup.rotation.x += deltaY * 0.006;
        this.linesGroup.rotation.y = this.nodesGroup.rotation.y;
        this.linesGroup.rotation.x = this.nodesGroup.rotation.x;

        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    // Click Raycast selection
    el.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.nodes, true);

      if (intersects.length > 0) {
        let hitMesh = intersects[0].object;
        while (hitMesh.parent && !hitMesh.userData.tool) {
          hitMesh = hitMesh.parent;
        }
        if (hitMesh && hitMesh.userData.tool) {
          this.selectNode(hitMesh);
        }
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight || 480;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  selectNode(nodeMesh) {
    this.selectedNode = nodeMesh;
    const tool = nodeMesh.userData.tool;

    if (window.cyberSound) window.cyberSound.playChirp();
    this.openInspector(tool);

    // Visual pulse effect
    nodeMesh.scale.set(1.5, 1.5, 1.5);
    setTimeout(() => {
      nodeMesh.scale.set(1, 1, 1);
    }, 300);
  }

  filterCategory(category) {
    this.nodes.forEach(node => {
      const tool = node.userData.tool;
      if (category === 'all' || tool.category === category) {
        node.visible = true;
        node.material.opacity = 1.0;
        node.material.transparent = false;
      } else {
        node.visible = true;
        node.material.transparent = true;
        node.material.opacity = 0.15;
      }
    });
  }

  openInspector(tool) {
    const inspector = document.getElementById('holo-inspector-panel');
    if (!inspector) return;

    inspector.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-badge-icon" style="color: ${this.hexToCss(tool.color)}; border-color: ${this.hexToCss(tool.color)};">
          <i class="${tool.icon}"></i>
        </div>
        <div class="inspector-titles">
          <span class="inspector-category">[${tool.category.toUpperCase()}]</span>
          <h3>${tool.name}</h3>
          <span class="inspector-role">${tool.role}</span>
        </div>
        <div class="inspector-prof-badge">
          <span>PROFICIENCY</span>
          <strong>${tool.proficiency}</strong>
        </div>
      </div>

      <p class="inspector-desc">${tool.desc}</p>

      <div class="inspector-features-grid">
        ${tool.features.map(f => `<div class="feat-tag"><i class="fas fa-microchip" style="color:${this.hexToCss(tool.color)}"></i> ${f}</div>`).join('')}
      </div>

      <div class="inspector-terminal-preview">
        <div class="preview-header">
          <span><i class="fas fa-terminal"></i> LIVE SIMULATOR / TELEMETRY</span>
          <button class="run-sim-btn" onclick="window.runToolSimulation('${tool.id}')">
            <i class="fas fa-play"></i> EXECUTE
          </button>
        </div>
        <div class="preview-code-box" id="tool-sim-output">
          <code>${tool.sampleCmd}</code>
        </div>
      </div>
    `;

    inspector.classList.add('active');
  }

  hexToCss(hex) {
    return '#' + hex.toString(16).padStart(6, '0');
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Slow auto rotation when not dragging
    if (!this.isDragging) {
      this.nodesGroup.rotation.y += 0.0025;
      this.linesGroup.rotation.y += 0.0025;
    }

    // Individual Node Rotation
    this.nodes.forEach(node => {
      node.rotation.x += 0.01;
      node.rotation.y += 0.015;
      if (node.userData.ring) {
        node.userData.ring.rotation.z += 0.02;
      }
    });

    // Hover Raycasting
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodes, true);

    if (intersects.length > 0) {
      this.container.style.cursor = 'pointer';
      let hitMesh = intersects[0].object;
      while (hitMesh.parent && !hitMesh.userData.tool) {
        hitMesh = hitMesh.parent;
      }
      if (hitMesh && hitMesh !== this.hoveredNode) {
        this.hoveredNode = hitMesh;
        if (window.cyberSound) window.cyberSound.playHover();
      }
    } else {
      this.container.style.cursor = 'grab';
      this.hoveredNode = null;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global simulation runner for tool inspector
window.runToolSimulation = function(toolId) {
  const out = document.getElementById('tool-sim-output');
  if (!out) return;

  if (window.cyberSound) window.cyberSound.playRadarPing();
  out.innerHTML = '<span style="color:var(--cyber-amber);"><i class="fas fa-spinner fa-spin"></i> Executing payload & correlating telemetry...</span>';

  setTimeout(() => {
    let result = '';
    switch (toolId) {
      case 'splunk':
        result = `
<span style="color:var(--cyber-green);">[SPLUNK SEARCH SUCCESSFUL]</span>
MATCHED_EVENTS: 42
| src_ip          | count | threat_score | action  |
| 192.168.1.105   | 28    | 88 (HIGH)    | BLOCKED |
| 10.0.0.42       | 14    | 45 (MED)     | FLAGGED |
`;
        break;
      case 'sentinel':
        result = `
<span style="color:var(--cyber-green);">[SENTINEL KQL DISPATCH]</span>
INCIDENT_ID: INC-9042
Severity: HIGH | Title: Suspicious Kerberoasting Activity
Automated Action: Dispatched Playbook "Block-AD-Entity"
`;
        break;
      case 'wireshark':
        result = `
<span style="color:var(--cyber-green);">[WIRESHARK PCAP STREAM ANALYZED]</span>
Packets: 1,480 | Anomaly: TCP SYN Scanning detected from external ASN
TCP Flags: SYN=1, ACK=0, Window=1024 -> Signature: Nmap SYN Stealth Scan
`;
        break;
      case 'nessus':
        result = `
<span style="color:var(--cyber-green);">[NESSUS AUDIT COMPLETE]</span>
Target: 192.168.1.0/24 | Assets Scanned: 16
Vulnerabilities: 0 Critical, 2 High (CVE-2023-XXXX), 4 Medium
Remediation report generated & saved to SOC repository.
`;
        break;
      case 'defender':
        result = `
<span style="color:var(--cyber-green);">[DEFENDER EDR ALERT ISOLATION]</span>
Host: WORKSTATION-09 | Threat: LSASS Memory Dump Attempt
Status: Process terminated, host isolated from network segment.
`;
        break;
      case 'python':
        result = `
<span style="color:var(--cyber-green);">[PYTHON AUTOMATION RUN]</span>
Parsed 50,000 firewall log lines in 0.42s
Identified 12 brute-force candidates -> Added to blocklist.
`;
        break;
      default:
        result = `
<span style="color:var(--cyber-green);">[EXECUTION VERIFIED]</span>
Payload evaluated across all simulated endpoints. Zero errors reported.
`;
        break;
    }

    out.innerHTML = `<pre style="font-family:var(--font-mono); font-size:0.82rem; margin:0;">${result}</pre>`;
    if (window.cyberSound) window.cyberSound.playAccessGranted();
  }, 700);
};

document.addEventListener('DOMContentLoaded', () => {
  window.skills3D = new Skills3DGalaxy();
});
