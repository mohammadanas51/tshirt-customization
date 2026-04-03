import React, { useMemo, useState, useEffect, useRef } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../store';


const DecalItem = ({ decal }) => {
  const texture = decal.type === 'logo' ? useTexture(decal.content) : null;
  
  // Persistent refs for canvas and texture to allow real-time updates for each instance
  const canvasRef = useRef(document.createElement('canvas'));
  const textureRef = useRef(new THREE.CanvasTexture(canvasRef.current));

  useEffect(() => {
    if (decal.type !== 'text') return;

    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = decal.color || '#000000';
    context.font = "Bold 150px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(decal.content, canvas.width / 2, canvas.height / 2);
    
    textureRef.current.needsUpdate = true;
  }, [decal.content, decal.color, decal.type]);

  const map = decal.type === 'logo' ? texture : textureRef.current;
  const scale = decal.scale || (decal.type === 'logo' ? 0.15 : 0.3);

  return (
    <Decal 
      position={decal.position} 
      rotation={decal.rotation} 
      scale={scale} 
      map={map} 
      map-anisotropy={16} 
      depthTest={false} 
      depthWrite={true}
    />
  );
}

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');


  // Dragging state
  const [dragTargetId, setDragTargetId] = useState(null);

  const handlePointerDown = (e) => {
    e.stopPropagation();

    const clickPoint = e.point;
    const hits = [];

    snap.decals.forEach((decal) => {
      const decalPos = new THREE.Vector3(...decal.position);
      const dist = clickPoint.distanceTo(decalPos);
      const radius = decal.type === 'logo' ? 0.08 : 0.15; // Hit radius based on decal type

      if (dist < radius) {
        hits.push({ id: decal.id, dist });
      }
    });

    if (hits.length > 0) {
      // Pick the closest hit
      hits.sort((a, b) => a.dist - b.dist);
      const targetId = hits[0].id;
      setDragTargetId(targetId);
      state.selectedDecalId = targetId;
      state.isDragging = true;
    }
  };

  const handlePointerUp = () => {
    setDragTargetId(null);
    state.isDragging = false;
  };

  const handlePointerMove = (e) => {
    // 1. Update cursor based on hover
    const hoverPoint = e.point;
    let isHovering = false;

    snap.decals.forEach((decal) => {
      const decalPos = new THREE.Vector3(...decal.position);
      const dist = hoverPoint.distanceTo(decalPos);
      const radius = decal.type === 'logo' ? 0.08 : 0.15;
      if (dist < radius) isHovering = true;
    });

    if (isHovering) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }

    // 2. Handle dragging
    if (!dragTargetId) return;
    e.stopPropagation();

    const newPoint = [e.point.x, e.point.y, e.point.z];
    const decalIndex = state.decals.findIndex(d => d.id === dragTargetId);
    if (decalIndex !== -1) {
      state.decals[decalIndex].position = newPoint;
    }
  };

  useFrame((_state, delta) => easing.dampC(materials.lambert1.color, state.color, 0.1, delta));

  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        {snap.decals.map((decal) => (
          <DecalItem
            key={decal.id}
            decal={decal}
          />
        ))}
      </mesh>
    </group>
  )
}

export default Shirt;