import React from 'react'
import { useSnapshot } from 'valtio'
import { SketchPicker } from 'react-color'

import state from '../store';

const TextPicker = () => {
  const snap = useSnapshot(state);
  const [target, setTarget] = React.useState('front'); // 'front' or 'back'
  const [textInput, setTextInput] = React.useState('New Text');
  const [colorInput, setColorInput] = React.useState('#000000');

  // Find currently selected text decal
  const selectedDecal = state.decals.find(d => d.id === snap.selectedDecalId && d.type === 'text');

  const handleAddText = () => {
    const id = Date.now().toString();
    const newDecal = {
      id: id,
      type: 'text',
      content: textInput,
      position: target === 'back'
        ? [Math.random() * 0.1 - 0.05, 0.04, -0.15]
        : [Math.random() * 0.1 - 0.05, 0.04, 0.15],
      rotation: target === 'back' ? [0, Math.PI, 0] : [0, 0, 0],
      scale: 0.3,
      side: target,
      color: colorInput
    };
    state.decals.push(newDecal);
    state.selectedDecalId = id; // Auto-select new decal
  };

  const handleUpdateText = (value) => {
    setTextInput(value);
    if (selectedDecal) selectedDecal.content = value;
  };

  const handleUpdateColor = (color) => {
    setColorInput(color.hex);
    if (selectedDecal) selectedDecal.color = color.hex;
  };

  const handleDelete = (id) => {
    state.decals = state.decals.filter(d => d.id !== id);
    if (state.selectedDecalId === id) state.selectedDecalId = null;
  };

  return (
    <div className="absolute left-full ml-3 glassmorphism p-3 rounded-md w-[220px] max-h-[85vh] overflow-y-auto">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 text-xs py-1 rounded-md ${target === 'front' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTarget('front')}
        >
          Front
        </button>
        <button
          className={`flex-1 text-[10px] py-1 rounded-md transition-all ${target === 'back' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-600'}`}
          onClick={() => setTarget('back')}
        >
          Back
        </button>
      </div>

      <p className="text-gray-700 text-xs font-bold mb-1">
        {selectedDecal ? (
          <span className="flex justify-between items-center w-full">
            Edit Selection 
            <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              {selectedDecal.side}
            </span>
          </span>
        ) : 'New Text Content'}
      </p>
      <input
        className="w-full bg-white/50 border border-gray-200 rounded-md p-1.5 mb-3 text-sm outline-none focus:border-blue-400"
        type="text"
        placeholder="Type here..."
        value={selectedDecal ? selectedDecal.content : textInput}
        onChange={(e) => handleUpdateText(e.target.value)}
      />

      <p className="text-gray-700 text-xs font-bold mb-1">
        {selectedDecal ? 'Edit Selection Color' : 'New Text Color'}
      </p>
      <div className="flex flex-col gap-3 mb-4">
        <SketchPicker
          color={selectedDecal ? selectedDecal.color : colorInput}
          disableAlpha
          onChange={handleUpdateColor}
        />
      </div>

      <button
        className="w-full py-2 bg-blue-500 text-white rounded-md text-xs font-bold mb-4 hover:bg-blue-600 transition-colors"
        onClick={handleAddText}
      >
        Add New Text to {target === 'front' ? 'Front' : 'Back'}
      </button>

      <div className="border-t border-gray-300 pt-3">
        <p className="text-gray-700 text-xs font-bold mb-2">Manage & Select Texts</p>
        <div className="flex flex-col gap-2">
          {snap.decals.filter(d => d.type === 'text').map((decal) => (
            <div 
              key={decal.id} 
              onClick={() => state.selectedDecalId = decal.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${snap.selectedDecalId === decal.id ? 'bg-blue-100 border border-blue-400' : 'bg-white/30'}`}
            >
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-bold truncate">{decal.content}</span>
                <span className="text-[8px] uppercase text-gray-500">{decal.side}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(decal.id);
                }}
                className="text-red-500 hover:text-red-700 text-xs font-bold ml-2"
              >
                ✕
              </button>
            </div>
          ))}
          {snap.decals.filter(d => d.type === 'text').length === 0 && (
            <span className="text-[10px] text-gray-500 italic">No texts added yet</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextPicker
