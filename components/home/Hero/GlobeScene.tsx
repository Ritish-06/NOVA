'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createEarthMesh } from './Earth';
import { createAtmosphereMesh } from './Atmosphere';
import { createChargingPointsGroup } from './ChargingPoints';
import GlobeControls from './GlobeControls';
import HeroFallback from './HeroFallback';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function GlobeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const router = useRouter();
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);
  const cameraTarget = useNovaStore((state) => state.globeCameraTarget);

  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Check WebGL
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        setIsInitializing(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      setIsInitializing(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xe8ddcc, 0.8);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthMesh = createEarthMesh();
    globeGroup.add(earthMesh);

    const atmosphereMesh = createAtmosphereMesh();
    globeGroup.add(atmosphereMesh);

    const pinsGroup = createChargingPointsGroup();
    globeGroup.add(pinsGroup);

    setIsInitializing(false);

    // 4. Raycaster & Pointer Handlers
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const domElement = renderer.domElement;

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

      const rect = domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(pinsGroup.children);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const stId = hit.userData.stationId;
        if (stId) {
          const st = MOCK_STATIONS.find((s) => s.id === stId);
          if (st) {
            setSelectedStation(st);
            router.push(`/stations/${st.id}`);
          }
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        mouseRef.current.targetX = (e.clientX - halfW) / halfW;
        mouseRef.current.targetY = (e.clientY - halfH) / halfH;
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 5. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        // Damped lerp cursor parallax
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

        // Extremely subtle continuous rotation ("Is the Earth moving?")
        globeGroup.rotation.y += 0.0012 + mouseRef.current.x * 0.0008;
        globeGroup.rotation.x += (mouseRef.current.y * 0.08 - globeGroup.rotation.x) * 0.04;
      }

      // Pulse pin markers subtly
      const time = Date.now() * 0.003;
      pinsGroup.children.forEach((child, idx) => {
        const scale = 1 + Math.sin(time + idx) * 0.12;
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
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [router, setSelectedStation]);

  if (!webGlSupported) {
    return <HeroFallback />;
  }

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-[600px] flex items-center justify-center select-none">
      
      {/* Short Initializing Badge */}
      {isInitializing && (
        <div className="absolute inset-0 bg-nova-bg flex items-center justify-center text-xs font-mono font-bold text-nova-accent z-20 gap-2">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>NOVA • INITIALIZING GLOBAL NETWORK...</span>
        </div>
      )}

      {/* WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Control Overlay */}
      <GlobeControls />
    </div>
  );
}
