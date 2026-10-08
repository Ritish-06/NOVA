'use client';

import * as THREE from 'three';
import { MOCK_STATIONS } from '@/lib/db/mockData';

export function latLngToVector3(lat: number, lng: number, radius: number = 2.03): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function createChargingPointsGroup(onSelectStation?: (stationId: string) => void): THREE.Group {
  const pinGroup = new THREE.Group();

  MOCK_STATIONS.forEach((station) => {
    const pos = latLngToVector3(station.latitude, station.longitude, 2.03);
    const isAvailable = station.status === 'AVAILABLE';

    const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isAvailable ? '#4A7C59' : '#C87D32'),
      emissive: new THREE.Color(isAvailable ? '#4A7C59' : '#C87D32'),
      emissiveIntensity: 0.7,
    });

    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pos);
    pinMesh.userData = { stationId: station.id, stationName: station.name };
    pinGroup.add(pinMesh);
  });

  return pinGroup;
}
