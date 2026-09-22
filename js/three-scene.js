/**
 * 3D Holographic Cyber Core & Particle Field
 * Built with Three.js
 */

class Cyber3DScene {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Objects
    this.coreGroup = null;
    this.innerCore = null;
    this.wireOrb = null;
    this.outerRings = [];
    this.particles = null;
    this.dataPackets = [];

    // Mouse & Parallax tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollProgress = 0;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded yet. Retrying...');
      setTimeout(() => this.init(), 100);
      return;
    }

    // 1. Create Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 22;

    // 2. Setup WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Add Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.6);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 2, 50);
    cyanLight.position.set(10, 10, 10);
    this.scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x00ff88, 1.8, 50);
    greenLight.position.set(-10, -10, 10);
    this.scene.add(greenLight);

    const purpleLight = new THREE.PointLight(0x9d4edd, 1.5, 50);
    purpleLight.position.set(0, 15, -5);
    this.scene.add(purpleLight);

    // 4. Build 3D Core Hierarchy
    this.buildCyberCore();
    this.buildParticleField();
    this.buildDataPackets();

    // 5. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));

    // 6. Start Render Loop
    this.animate();
  }

  buildCyberCore() {
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(4.5, 0, 0); // Position to the right on desktop hero

    // Responsive positioning check
    if (window.innerWidth < 992) {
      this.coreGroup.position.set(0, 1.5, -4);
    }

    // 1. Black Hat Stealth Chassis - Inner Faceted Core
    const innerGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.15,
      metalness: 0.95
    });
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerCore);

    // 2. Faceted Central Dark Crystal / Black Hat Core Void
    const crystalGeo = new THREE.OctahedronGeometry(1.8, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x050c1e,
      emissive: 0x00ff88,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.9
    });
    this.crystalCore = new THREE.Mesh(crystalGeo, crystalMat);
    this.coreGroup.add(this.crystalCore);

    // 3. Outer Geodesic Defensive Shield Wireframe
    const sphereGeo = new THREE.SphereGeometry(3.8, 28, 28);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    this.wireOrb = new THREE.Mesh(sphereGeo, sphereMat);
    this.coreGroup.add(this.wireOrb);

    // 4. Sweeping Laser Radar Scanner Line
    const laserGeo = new THREE.BufferGeometry();
    const laserVerts = new Float32Array([0, 0, 0, 4.8, 0, 0]);
    laserGeo.setAttribute('position', new THREE.BufferAttribute(laserVerts, 3));
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    this.laserScanner = new THREE.Line(laserGeo, laserMat);
    this.coreGroup.add(this.laserScanner);

    // 5. Decryption Cipher Orbital Rings
    const ringRadii = [4.5, 5.3, 6.2];
    const ringColors = [0x00f2fe, 0x00ff88, 0x9d4edd];

    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.05, 72);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      
      ring.rotation.x = Math.PI / (2 + idx * 0.35);
      ring.rotation.y = (Math.PI / 4) * idx;
      
      this.outerRings.push({
        mesh: ring,
        speedX: 0.004 * (idx % 2 === 0 ? 1 : -1),
        speedY: 0.006 * (idx % 2 === 0 ? -1 : 1),
        speedZ: 0.003 * (idx + 1)
      });
      this.coreGroup.add(ring);
    });

    // 6. Interactive Click Pulse Listener
    window.addEventListener('click', () => {
      if (this.coreGroup) {
        this.pulseCore();
      }
    });

    this.scene.add(this.coreGroup);
  }

  pulseCore() {
    if (!this.coreGroup) return;
    this.coreGroup.scale.set(1.18, 1.18, 1.18);
    if (this.crystalCore) {
      this.crystalCore.material.emissiveIntensity = 1.0;
    }
    setTimeout(() => {
      if (this.coreGroup) this.coreGroup.scale.set(1, 1, 1);
      if (this.crystalCore) this.crystalCore.material.emissiveIntensity = 0.35;
    }, 280);
  }

  buildParticleField() {
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00f2fe);
    const color2 = new THREE.Color(0x00ff88);
    const color3 = new THREE.Color(0x4facfe);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spread across wide space
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 60;

      // Color variation
      const rand = Math.random();
      const c = rand < 0.4 ? color1 : rand < 0.7 ? color2 : color3;
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  buildDataPackets() {
    const packetCount = 8;
    const packetGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false
    });

    for (let i = 0; i < packetCount; i++) {
      const packet = new THREE.Mesh(packetGeo, packetMat);
      this.dataPackets.push({
        mesh: packet,
        angle: (i / packetCount) * Math.PI * 2,
        radius: 4.4 + (i % 3) * 0.8,
        speed: 0.015 + (i % 2) * 0.01,
        planeIdx: i % 3
      });
      this.coreGroup.add(packet);
    }
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onScroll() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 992) {
      this.coreGroup.position.set(0, 1.5, -4);
    } else {
      this.coreGroup.position.set(4.5, 0, 0);
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Smooth mouse lerping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Rotate Core
    if (this.innerCore) {
      this.innerCore.rotation.x += 0.005;
      this.innerCore.rotation.y += 0.008;
    }

    if (this.wireOrb) {
      this.wireOrb.rotation.x -= 0.003;
      this.wireOrb.rotation.y -= 0.004;
    }

    if (this.crystalCore) {
      this.crystalCore.rotation.x -= 0.008;
      this.crystalCore.rotation.y += 0.012;
    }

    if (this.laserScanner) {
      this.laserScanner.rotation.z += 0.035;
    }

    // Rotate Rings
    this.outerRings.forEach(ringObj => {
      ringObj.mesh.rotation.x += ringObj.speedX;
      ringObj.mesh.rotation.y += ringObj.speedY;
      ringObj.mesh.rotation.z += ringObj.speedZ;
    });

    // Orbit Data Packets
    this.dataPackets.forEach(pkt => {
      pkt.angle += pkt.speed;
      const x = Math.cos(pkt.angle) * pkt.radius;
      const z = Math.sin(pkt.angle) * pkt.radius;
      const y = Math.sin(pkt.angle * 2) * 1.2;
      pkt.mesh.position.set(x, y, z);
    });

    // Parallax Response to Scroll & Mouse
    if (this.coreGroup) {
      this.coreGroup.rotation.y = this.mouseX * 0.4 + this.scrollProgress * Math.PI * 2;
      this.coreGroup.rotation.x = this.mouseY * 0.3;
      this.coreGroup.position.y = (window.innerWidth < 992 ? 1.5 : 0) - this.scrollProgress * 6;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.0006;
      this.particles.rotation.x = this.mouseY * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cyber3d = new Cyber3DScene();
});
