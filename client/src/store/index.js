import { proxy } from "valtio";

const state = proxy({
  // intro: true,
  intro: false,
  color: "#EFBD48",
  decals: [
    {
      id: "default-logo",
      type: "logo",
      content: "./threejs.png",
      position: [0, 0.04, 0.15],
      rotation: [0, 0, 0],
      scale: 0.15,
      side: "front",
    },
    {
      id: "default-text",
      type: "text",
      content: "Your Text",
      position: [0, -0.04, 0.15],
      rotation: [0, 0, 0],
      scale: 0.3,
      color: "#000000",
      side: "front",
    },
  ],
  selectedDecalId: "default-text",
  isDragging: false,
});

export default state;
