# Technical Documentation: 3D T-Shirt Customizer

This document provides a comprehensive technical overview of the 3D T-Shirt Customizer application, detailing its architecture, technology stack, and core implementation strategies.

---

## 1. Project Overview

The **3D T-Shirt Customizer** is a high-performance web application designed for real-time 3D product visualization. It allows users to:
- Interactively change the shirt's color.
- Add and position multiple decals (logos and dynamic text).
- Experience smooth animations and transitions between the landing page and the customization interface.

---

## 2. Technology Stack

The application is built using a modern React-based stack:

- **Frontend Framework**: [React](https://reactjs.org/) (Vite-powered)
- **3D Graphics Engine**: [Three.js](https://threejs.org/)
- **React 3D Integration**: [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Valtio](https://valtio.pmnd.rs/) (Proxy-based state)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Mathematical Utilities**: [Maath](https://github.com/pmndrs/maath) (for 3D easing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 3. Application Architecture

### 3.1 Global State Management (Valtio)
The project uses **Valtio** for high-performance, reactive state. The global state is defined in `src/store/index.js` as a proxy object:

```javascript
const state = proxy({
  intro: true,         // Toggle between Hero and Customizer
  color: "#EFBD48",    // Current shirt color
  decals: [...],       // Array of decal objects (logo/text)
  selectedDecalId: "", // ID of the currently selected decal
  isDragging: false,   // State for decal repositioning
});
```
Components subscribe to this state using `useSnapshot(state)`, ensuring that only the relevant parts of the UI re-render when the state changes.

### 3.2 Landing vs. Customizer
- **Home.jsx**: Uses `Framer Motion` for an animated entrance. Clicking "Customize It" sets `state.intro = false`, triggering a seamless transition to the editor.
- **Customizer.jsx**: Provides the UI for color picking, file uploading (logos), and text editing.

---

## 4. 3D Implementation Details

### 4.1 The 3D Canvas (`CanvasModel`)
The scene is initialized in `src/canvas/index.jsx` with shadows, a specific camera FOV, and standard lighting:
- **Environment**: Uses a high-definition HDR environment for realistic reflections and lighting.
- **CameraRig**: A custom component that adds subtle camera movement based on mouse position.
- **OrbitControls**: Enabled only in the customizer view to allow 3D rotation, but disabled during decal dragging.

### 4.2 The Shirt Model (`Shirt.jsx`)
The shirt is a GLB model loaded via `useGLTF`. 
- **Material**: Uses a `MeshLambertMaterial` (lambert1) for a realistic cloth appearance.
- **Color Transitions**: Smoothly transitions between selected colors using `easing.dampC` inside the `useFrame` loop.

### 4.3 Dynamic Decal System
The application supports two types of decals:
1. **Logo Decals**: Loaded from external image files using `useTexture`.
2. **Text Decals**: Dynamically generated using a 2D HTML Canvas.

#### Text Decal Logic:
Inside `DecalItem`, a 2D canvas is created for each text decal. 
```javascript
const context = canvas.getContext('2d');
context.fillText(decal.content, canvas.width / 2, canvas.height / 2);
const texture = new THREE.CanvasTexture(canvas);
```
This texture is then projected onto the 3D mesh using the `<Decal />` component from `@react-three/drei`.

---

## 5. Interaction Logic

### 5.1 Decal Dragging (Repositioning)
Repositioning decals on the 3D model is handled by intercepting pointer events on the 3D mesh:
- **Hit Detection**: Calculated by measuring the distance between the pointer intersection point and the stored decal positions in the global state.
- **State Updates**: When a decal is dragged, its `position` coordinate in the Valtio state is updated in real-time, causing the `<Decal />` component to move across the mesh surface.

### 5.2 Responsive Camera
The camera position and orientation are adjusted dynamically based on whether the application is in "Hero" mode or "Customizer" mode, ensuring the 3D model is always perfectly framed.

---

## 6. Performance Optimizations
- **Valtio Proxies**: Minimize React re-renders by only updating the specific data points that change.
- **Geometry Disposal**: Properly handling Three.js object disposal to prevent memory leaks during long customization sessions.
- **Frustum Culling**: Default Three.js behavior refined for the specific shirt model to ensure efficient GPU usage.

---
> [!TIP]
> To modify the model, replace `shirt_baked.glb` in the public directory and update the node names in `Shirt.jsx` if they differ from the original names.
