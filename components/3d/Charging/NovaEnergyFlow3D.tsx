'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Zap } from 'lucide-react';

export default function NovaEnergyFlow3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#171513'); // Dark contrast canvas for energy glow

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 1. Four Stage Nodes: GRID -> CHARGER -> VEHICLE -> BATTERY
    const nodes = [
      { name: 'GRID', x: -3, color: '#E8DDCC' },
      { name: 'CHARGER', x: -1, color: '#A78663' },
      { name: 'VEHICLE', x: 1, color: '#78806B' },
      { name: 'BATTERY', x: 3, color: '#4A7C59' },
    ];

    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    nodes.forEach((n) => {
      const geo = new THREE.SphereGeometry(0.35, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(n.color),
        emissive: new THREE.Color(n.color),
        emissiveIntensity: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(n.x, 0, 0);
      nodeGroup.add(mesh);
    });

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    // 2. Particle Stream Flow across Nodes
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6; // x along line
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // slight y offset
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4; // slight z offset
      speeds[i] = 0.03 + Math.random() * 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#78806B'),
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const pos = particleGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += speeds[i];
        if (pos[i * 3] > 3.2) {
          pos[i * 3] = -3.2; // loop back to GRID
        }
      }

      particleGeo.attributes.position.needsUpdate = true;

      // Pulse nodes
      const time = Date.now() * 0.004;
      nodeGroup.children.forEach((child, index) => {
        const scale = 1 + Math.sin(time + index) * 0.1;
        child.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/10 bg-nova-dark shadow-elevated">
      <div ref={mountRef} className="w-full h-full" />

      {/* Stage Labels Overlay */}
      <div className="absolute bottom-4 inset-x-4 flex justify-between text-[11px] font-mono font-bold text-nova-primary uppercase tracking-wider">
        <span>GRID</span>
        <span>CHARGER</span>
        <span>VEHICLE</span>
        <span>BATTERY</span>
      </div>
    </div>
  );
}
