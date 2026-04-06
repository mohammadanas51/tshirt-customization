import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import state from '../store';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      frameloop="always"
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <directionalLight position={[0, 0, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <Environment files="/potsdamer_platz_1k.hdr" />

        <CameraRig>
          {!snap.viewOnly && !snap.intro && <Backdrop />}
          <Center>
            <Shirt />
          </Center>
        </CameraRig>

        {!snap.intro && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={3.5}
            enabled={!snap.isDragging}
          />
        )}
      </Suspense>
    </Canvas>
  )
}

export default CanvasModel