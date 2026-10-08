'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';

export function createEarthMesh(): THREE.Mesh {
  const globeGeo = new THREE.SphereGeometry(2, 64, 64);
  
  // Custom procedural texture canvas for Earth continent outlines
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#E8DDCC';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle grid lines for editorial spatial look
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
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

  const texture = new THREE.CanvasTexture(canvas);
  const globeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FAF5EE'),
    roughness: 0.7,
    metalness: 0.1,
    map: texture,
  });

  return new THREE.Mesh(globeGeo, globeMat);
}
