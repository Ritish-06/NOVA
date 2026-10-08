'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { RotateCcw, Crosshair, Search, ShieldCheck } from 'lucide-react';

interface NovaGlobeProps {
  onStationSelect?: (stationId: string) => void;
  interactive?: boolean;
}

// Helper to convert lat/lng to 3D Sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number = 2): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function NovaGlobe({ onStationSelect, interactive = true }: NovaGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraTarget = useNovaStore((state) => state.globeCameraTarget);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);

  const [webGlSupported, setWebGlSupported] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Mouse lerp ref (never trigger React state re-render on mousemove!)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7F3EC');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xe8ddcc, 0.8);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // 3. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe Sphere Geometry (Radius 2)
    const globeGeo = new THREE.SphereGeometry(2, 64, 64);
    
    // Textured canvas shader for continent outlines
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#E8DDCC';
      ctx.fillRect(0, 0, 1024, 512);

      // Subtle longitude & latitude grid lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < 1024; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y < 512; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
    }

    const globeTexture = new THREE.CanvasTexture(canvas);
    const globeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FAF5EE'),
      roughness: 0.7,
      metalness: 0.1,
      map: globeTexture,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 4. Subtle Atmosphere Glow Sphere
    const atmosphereGeo = new THREE.SphereGeometry(2.08, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#A78663'),
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 5. Charging Point Markers
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const pinsList: { mesh: THREE.Mesh; stationId: string; lat: number; lng: number }[] = [];

    MOCK_STATIONS.forEach((station) => {
      const pos = latLngToVector3(station.latitude, station.longitude, 2.03);
      
      const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const isAvailable = station.status === 'AVAILABLE';
      const pinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isAvailable ? '#4A7C59' : '#C87D32'),
        emissive: new THREE.Color(isAvailable ? '#4A7C59' : '#C87D32'),
        emissiveIntensity: 0.6,
      });

      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { stationId: station.id, stationName: station.name };
      pinGroup.add(pinMesh);

      pinsList.push({ mesh: pinMesh, stationId: station.id, lat: station.latitude, lng: station.longitude });
    });

    // 6. Connection Arcs between Global Hubs (London -> Dubai -> Chennai -> Tokyo -> NYC)
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    const hubPairs = [
      [MOCK_STATIONS[0], MOCK_STATIONS[2]], // London -> Dubai
      [MOCK_STATIONS[2], MOCK_STATIONS[3]], // Dubai -> Chennai
      [MOCK_STATIONS[3], MOCK_STATIONS[6]], // Chennai -> Singapore
      [MOCK_STATIONS[6], MOCK_STATIONS[8]], // Singapore -> Tokyo
      [MOCK_STATIONS[7], MOCK_STATIONS[0]], // NYC -> London
    ];

    hubPairs.forEach(([fromSt, toSt]) => {
      if (!fromSt || !toSt) return;
      const v1 = latLngToVector3(fromSt.latitude, fromSt.longitude, 2.01);
      const v2 = latLngToVector3(toSt.latitude, toSt.longitude, 2.01);

      // Interpolate arc midpoint pulling outwards
      const mid = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(2.4);
      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#78806B'),
        transparent: true,
        opacity: 0.45,
        linewidth: 1,
      });

      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(arcLine);
    });

    // 7. Raycaster for Pin Interaction
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(pinGroup.children);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const stId = hit.userData.stationId;
        if (stId) {
          setSelectedPin(stId);
          const st = MOCK_STATIONS.find((s) => s.id === stId);
          if (st) {
            setSelectedStation(st);
            if (onStationSelect) onStationSelect(stId);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);

    // Mouse move handler for lerp parallax
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Loop with Lerp / Damping
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Slow rotation + subtle cursor influence
      globeGroup.rotation.y += 0.0015 + mouseRef.current.x * 0.001;
      globeGroup.rotation.x += (mouseRef.current.y * 0.1 - globeGroup.rotation.x) * 0.05;

      // Pulse pin markers subtly
      const time = Date.now() * 0.003;
      pinGroup.children.forEach((child, index) => {
        const scale = 1 + Math.sin(time + index) * 0.15;
        child.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
      window.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, onStationSelect, setSelectedStation]);

  // Handle camera jump when target changes
  useEffect(() => {
    if (cameraTarget && mountRef.current) {
      // Smoothly zoom or log target
    }
  }, [cameraTarget]);

  return (
    <div className="relative w-full h-full min-h-[450px] flex items-center justify-center overflow-hidden select-none">
      
      {/* WebGL Canvas Container */}
      {webGlSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Fallback 2D Map Canvas if WebGL is unavailable */
        <div className="w-full h-full bg-nova-bg flex flex-col items-center justify-center p-8 text-center border border-[#E8DDCC] rounded-3xl">
          <GlobeFallback2D />
        </div>
      )}

      {/* Floating 3D Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full border border-[#E8DDCC] shadow-elevated z-10">
        <button
          onClick={() => {
            const st = MOCK_STATIONS[0];
            useNovaStore.getState().setGlobeCameraTarget({ lat: st.latitude, lng: st.longitude, zoom: 5 });
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-nova-text hover:text-nova-dark px-2.5 py-1 rounded-full hover:bg-nova-bg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5 text-nova-accent" />
          <span>Reset</span>
        </button>

        <span className="w-px h-4 bg-[#E8DDCC]" />

        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  useNovaStore.getState().setGlobeCameraTarget({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 8 });
                },
                () => alert('Location permission denied. You can search manually.')
              );
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-nova-text hover:text-nova-dark px-2.5 py-1 rounded-full hover:bg-nova-bg transition-colors"
          title="Locate Me"
        >
          <Crosshair className="w-3.5 h-3.5 text-nova-energy" />
          <span>Locate</span>
        </button>
      </div>

      {/* Legend & Freshness Badge */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8DDCC] shadow-subtle text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-nova-status-available animate-pulse" />
          <span className="font-medium text-nova-text">Available Bay</span>
        </div>
        <span className="w-px h-3 bg-[#E8DDCC]" />
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-nova-status-busy" />
          <span className="font-medium text-nova-text">In Use</span>
        </div>
      </div>
    </div>
  );
}

// 2D Fallback SVG Globe Component
function GlobeFallback2D() {
  return (
    <div className="space-y-4">
      <div className="w-24 h-24 mx-auto rounded-full bg-nova-primary/50 flex items-center justify-center text-nova-dark animate-pulse">
        <ShieldCheck className="w-10 h-10 text-nova-accent" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-nova-text">2D Geographic View Active</h3>
        <p className="text-xs text-nova-muted max-w-sm mt-1">
          WebGL rendering disabled on this device. Fully functional 2D Interactive Map available in Explore mode.
        </p>
      </div>
    </div>
  );
}
