'use client';

import * as THREE from 'three';

export function createAtmosphereMesh(): THREE.Mesh {
  const atmosphereGeo = new THREE.SphereGeometry(2.08, 64, 64);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#A78663'),
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
  });
  return new THREE.Mesh(atmosphereGeo, atmosphereMat);
}
