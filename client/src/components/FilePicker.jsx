import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'

import CustomButton from './CustomButton'

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  const selectedDecal = snap.decals.find(d => d.id === snap.selectedDecalId && d.type === 'logo');

  const handleDelete = (id) => {
    state.decals = state.decals.filter(d => d.id !== id);
    if (state.selectedDecalId === id) state.selectedDecalId = null;
  };

  const handleUpdateScale = (value) => {
    const scale = parseFloat(value);
    const decal = state.decals.find(d => d.id === snap.selectedDecalId && d.type === 'logo');
    if (decal) {
      decal.scale = scale;
    }
  };

  return (
    <div className="filepicker-container max-h-[85vh] overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === '' ? "No file selected" : file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CustomButton
          type="outline"
          title="Add Front Image"
          handleClick={() => readFile('logo')}
          customStyles="text-xs flex-1"
          color="#000"
        />
        <CustomButton
          type="outline"
          title="Add Back Image"
          handleClick={() => readFile('logoBack')}
          customStyles="text-xs flex-1"
          color="#000"
        />
      </div>

      <div className="mt-4 px-1">
        <p className="text-gray-700 text-xs font-bold mb-1">
          {selectedDecal ? 'Adjust Image Size' : 'Default Image Size'}
        </p>
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.01"
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 ${!selectedDecal ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedDecal}
          value={selectedDecal ? selectedDecal.scale : 0.15}
          onChange={(e) => handleUpdateScale(e.target.value)}
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-4 pt-3 w-full">
        <p className="text-gray-700 text-xs font-bold mb-2">Manage Images</p>
        <div className="flex flex-col gap-2">
          {snap.decals.filter(d => d.type === 'logo').map((decal) => (
            <div
              key={decal.id}
              onClick={() => state.selectedDecalId = decal.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${snap.selectedDecalId === decal.id ? 'bg-blue-100 border border-blue-400 font-bold' : 'bg-white/30 hover:bg-white/50'}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={decal.content} alt="decal" className="w-6 h-6 object-contain rounded-sm" />
                <span className="text-[10px] truncate">Image </span>
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
          {snap.decals.filter(d => d.type === 'logo').length === 0 && (
            <span className="text-[10px] text-gray-500 italic">No images added yet</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilePicker