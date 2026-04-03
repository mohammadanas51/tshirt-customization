import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'

import CustomButton from './CustomButton'

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  const handleDelete = (id) => {
    state.decals = state.decals.filter(d => d.id !== id);
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

      <div className="border-t border-gray-300 mt-4 pt-3 w-full">
        <p className="text-gray-700 text-xs font-bold mb-2">Manage Images</p>
        <div className="flex flex-col gap-2">
          {snap.decals.filter(d => d.type === 'logo').map((decal) => (
            <div key={decal.id} className="flex items-center justify-between bg-white/30 p-2 rounded-md">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={decal.content} alt="decal" className="w-6 h-6 object-contain rounded-sm" />
                <span className="text-[8px] uppercase text-gray-500">{decal.side}</span>
              </div>
              <button 
                onClick={() => handleDelete(decal.id)}
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