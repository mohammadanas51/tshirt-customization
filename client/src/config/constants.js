import { swatch3d, file3d, text3d, logoShirt, stylishShirt } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch3d,
  },
  {
    name: "filepicker",
    icon: file3d,
  },
  {
    name: "textpicker",
    icon: text3d,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "logoShirtBack",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
  {
    name: "textShirt",
    icon: text3d,
  },
  {
    name: "textShirtBack",
    icon: text3d,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterProperty: "isLogoTexture",
  },
  logoBack: {
    stateProperty: "logoDecalBack",
    filterProperty: "isLogoTextureBack",
  },
  text: {
    stateProperty: "textContent",
    filterProperty: "isTextTexture",
  },
  textBack: {
    stateProperty: "textContentBack",
    filterProperty: "isTextTextureBack",
  },
};
