'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ChargingStation } from '@/types';
import { RotateCcw, Zap, CheckCircle2 } from 'lucide-react';

interface NovaStation3DProps {
  station: ChargingStation;
  onSelectConnector?: (connectorId: string) => void;
}

export default function NovaStation3D({ station, onSelectConnector }: NovaStation3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(
    station.connectors[0]?.id || null
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7F3EC');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    // 1. Parking Bay Floor
    const floorGeo = new THREE.PlaneGeometry(8, 6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8DDCC'),
      roughness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    scene.add(floorMesh);

    // Bay Lines
    const lineGeo = new THREE.PlaneGeometry(0.1, 4);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineMesh1 = new THREE.Mesh(lineGeo, lineMat);
    lineMesh1.rotation.x = -Math.PI / 2;
    lineMesh1.position.set(-1.8, 0.01, 0);
    scene.add(lineMesh1);

    const lineMesh2 = new THREE.Mesh(lineGeo, lineMat);
    lineMesh2.rotation.x = -Math.PI / 2;
    lineMesh2.position.set(1.8, 0.01, 0);
    scene.add(lineMesh2);

    // 2. EV Vehicle Box Mesh Representation
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Car Body
    const bodyGeo = new THREE.BoxGeometry(1.8, 0.7, 3.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#171513'),
      roughness: 0.3,
      metalness: 0.6,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.45;
    carGroup.add(bodyMesh);

    // Car Cabin / Roof
    const roofGeo = new THREE.BoxGeometry(1.5, 0.5, 1.8);
    const roofMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#40372F'),
      roughness: 0.2,
      metalness: 0.8,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 0.95, -0.2);
    carGroup.add(roofMesh);

    carGroup.position.set(0, 0, 0.4);

    // 3. Charger Units (2 Pillars at the back)
    const chargerGroup = new THREE.Group();
    scene.add(chargerGroup);

    station.connectors.forEach((conn, index) => {
      const xPos = (index - (station.connectors.length - 1) / 2) * 1.6;

      // Pillar Stand
      const chargerGeo = new THREE.BoxGeometry(0.5, 1.6, 0.4);
      const chargerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFFFF'),
        roughness: 0.2,
        metalness: 0.4,
      });
      const chargerMesh = new THREE.Mesh(chargerGeo, chargerMat);
      chargerMesh.position.set(xPos, 0.8, -1.8);
      chargerMesh.userData = { connectorId: conn.id };
      chargerGroup.add(chargerMesh);

      // Glowing LED Screen on Charger
      const screenGeo = new THREE.PlaneGeometry(0.35, 0.4);
      const isAvailable = conn.status === 'AVAILABLE';
      const screenMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(isAvailable ? '#4A7C59' : '#C87D32'),
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(xPos, 1.1, -1.59);
      chargerGroup.add(screenMesh);
    });

    // Gentle camera animation loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow orbital rotate
      angle += 0.003;
      camera.position.x = Math.sin(angle) * 6;
      camera.position.z = Math.cos(angle) * 6;
      camera.lookAt(0, 0.5, 0);

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
  }, [station]);

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#E8DDCC] bg-nova-bg">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8DDCC] text-xs font-mono text-nova-dark shadow-subtle flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-nova-accent" />
        <span>3D Charging Hub Bay</span>
      </div>
    </div>
  );
}
