import React, { useMemo, useState, useEffect, useRef, Suspense, Component } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../store';

// Error Boundary to prevent a single failed texture (CORS or network) from crashing the mesh
class DecalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Decal loading error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}


// Helper to bypass CORS for specific domains by using a proxy
const getProxiedUrl = (url) => {
  if (!url) return url;
  if (url.includes('strackit.com')) {
    // Using images.weserv.nl which is a dedicated free image proxy that supports CORS
    // This avoids "Content-Type" restrictions found on other free proxies.
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const LogoDecal = ({ decal }) => {
  // Validate decal content to avoid crashing on truncated base64 strings
  const isValidUrl = useMemo(() => {
    if (!decal.content) return false;
    if (decal.content.includes('...')) return false;
    // Support local, external, and data URLs
    return decal.content.startsWith('./') || 
           decal.content.startsWith('http') || 
           decal.content.startsWith('data:image');
  }, [decal.content]);

  // Apply proxy if necessary to bypass CORS restrictions
  const finalUrl = useMemo(() => {
    return isValidUrl ? getProxiedUrl(decal.content) : './threejs.png';
  }, [decal.content, isValidUrl]);

  // Only call useTexture if the URL is valid. 
  // If invalid, we use a placeholder so the decal is still visible for layout verification.
  const texture = useTexture(finalUrl);
  
  const scaleVal = decal.scale || 0.15;
  const scale = [scaleVal, scaleVal, 0.1];

  return (
    <Decal 
      position={decal.position} 
      rotation={decal.rotation} 
      scale={scale} 
      map={texture} 
      map-anisotropy={16} 
      depthTest={false} 
      depthWrite={true}
    />
  );
}

const TextDecal = ({ decal }) => {
  const canvasRef = useRef(document.createElement('canvas'));
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = decal.color || '#000000';
    context.font = "Bold 150px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(decal.content || '', canvas.width / 2, canvas.height / 2);
    
    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.needsUpdate = true;
    setTexture(newTexture);
  }, [decal.content, decal.color]);

  if (!texture) return null;

  const scaleVal = decal.scale || 0.3;
  const scale = [scaleVal, scaleVal, 0.1];

  return (
    <Decal 
      position={decal.position} 
      rotation={decal.rotation} 
      scale={scale} 
      map={texture} 
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
    if (snap.viewOnly) return;
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
    if (snap.viewOnly) return;
    setDragTargetId(null);
    state.isDragging = false;
  };

  const handlePointerMove = (e) => {
    if (snap.viewOnly) return;
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
          decal.type === 'logo' ? (
            <DecalErrorBoundary key={`${decal.id}-logo`} fallback={<LogoDecal decal={{...decal, content: './threejs.png'}} />}>
              <Suspense fallback={null}>
                <LogoDecal 
                  decal={decal} 
                />
              </Suspense>
            </DecalErrorBoundary>
          ) : (
            <DecalErrorBoundary key={`${decal.id}-text`} fallback={null}>
              <Suspense fallback={null}>
                <TextDecal 
                  decal={decal} 
                />
              </Suspense>
            </DecalErrorBoundary>
          )
        ))}
      </mesh>
    </group>
  )
}

export default Shirt;