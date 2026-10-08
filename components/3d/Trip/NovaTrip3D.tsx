'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TripPlan } from '@/types';
import { Navigation, Zap } from 'lucide-react';

interface NovaTrip3DProps {
  tripPlan: TripPlan;
}

export default function NovaTrip3D({ tripPlan }: NovaTrip3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7F3EC');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 1. Terrain Base Plane
    const planeGeo = new THREE.PlaneGeometry(12, 8);
    const planeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8DDCC'),
      roughness: 0.8,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = -Math.PI / 2;
    scene.add(planeMesh);

    // 2. Route Curve (Bezier Path)
    const p1 = new THREE.Vector3(-4, 0.05, 1.5);
    const p2 = new THREE.Vector3(-1, 0.05, -2);
    const p3 = new THREE.Vector3(2, 0.05, 1);
    const p4 = new THREE.Vector3(4.5, 0.05, -1);

    const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
    const points = curve.getPoints(100);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    const curveMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#171513'),
      linewidth: 3,
    });
    const routeLine = new THREE.Line(curveGeo, curveMat);
    scene.add(routeLine);

    // 3. Charging Stop Pins along route
    const stopPoints = [curve.getPoint(0.35), curve.getPoint(0.70)];
    stopPoints.forEach((pt) => {
      const pinGeo = new THREE.CylinderGeometry(0.15, 0, 0.6, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4A7C59'),
        emissive: new THREE.Color('#4A7C59'),
        emissiveIntensity: 0.5,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(pt.x, 0.3, pt.z);
      scene.add(pinMesh);
    });

    // 4. Moving EV Indicator Sphere
    const vehicleGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const vehicleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#A78663'),
      emissive: new THREE.Color('#A78663'),
      emissiveIntensity: 0.8,
    });
    const vehicleMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
    scene.add(vehicleMesh);

    // Animation Loop
    let animationFrameId: number;
    let progress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      progress = (progress + 0.003) % 1;
      const currentPos = curve.getPoint(progress);
      vehicleMesh.position.set(currentPos.x, 0.25, currentPos.z);

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
  }, [tripPlan]);

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#E8DDCC] bg-nova-bg">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8DDCC] text-xs font-mono text-nova-dark shadow-subtle flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-nova-accent" />
        <span>3D Animated Route & Charging Stops</span>
      </div>
    </div>
  );
}
