import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import Canvas from '../canvas';
import state from '../store';
import { CustomButton } from '../components';
import { fadeAnimation, slideAnimation } from '../config/motion';

const ReconstructDesign = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReconstruct = () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData.color || !Array.isArray(parsedData.decals)) {
        throw new Error('Invalid JSON format. Must contain "color" and "decals" array.');
      }

      // Update state
      state.color = parsedData.color;
      state.decals = parsedData.decals;
      state.viewOnly = true;
      
      setIsApplied(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to parse JSON. Please check the format.');
    }
  };

  const handleReset = () => {
    setIsApplied(false);
    state.viewOnly = false;
  };

  const handleExit = () => {
    // Reset to initial default design
    state.color = "#EFBD48";
    state.decals = [
      {
        id: "default-logo",
        type: "logo",
        content: "./threejs.png",
        position: [0, 0.04, 0.15],
        rotation: [0, 0, 0],
        scale: 0.15,
        side: "front",
      },
    ];
    state.viewOnly = false;
    navigate('/');
  };

  return (
    <AnimatePresence>
      <div className="relative w-full h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Main Input Card - Only visible when not applied */}
        {!isApplied && (
          <motion.div
            className="bg-white/90 glassmorphism p-8 rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20 z-10"
            {...slideAnimation('up')}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Reconstruct Design
              </h2>
              <button 
                onClick={handleExit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Back to Home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Paste your design JSON below to reconstruct and visualize the 3D model.
            </p>

            <textarea
              className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs resize-none shadow-inner"
              placeholder='{ "color": "#4a4a4a", "decals": [...] }'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />

            {error && (
              <p className="text-red-500 mt-3 text-xs font-medium">
                ⚠️ {error}
              </p>
            )}

            <div className="flex gap-4 mt-8">
              <CustomButton
                type="filled"
                title="Apply & Visualize"
                handleClick={handleReconstruct}
                customStyles="flex-1 py-3 font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all"
              />
              <CustomButton
                type="outline"
                title="Cancel"
                handleClick={handleExit}
                customStyles="px-8 py-3 rounded-xl border-gray-300 text-gray-700"
              />
            </div>
          </motion.div>
        )}

        {/* 3D Model Dialog Box */}
        <AnimatePresence>
          {isApplied && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 mt-0"
              {...fadeAnimation}
            >
              <motion.div
                className="bg-white/95 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-5xl h-[85vh] relative overflow-hidden border border-white/40 flex flex-col"
                {...slideAnimation('up')}
              >
                {/* Header with X icon */}
                <div className="absolute top-6 right-8 z-[60]">
                  <button 
                    onClick={handleReset}
                    className="p-2 bg-gray-100/80 hover:bg-red-500 hover:text-white rounded-full text-gray-500 transition-all duration-300 shadow-md"
                    title="Close and Edit JSON"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-8 pb-0 text-center">
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                    Refined Design Preview
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-semibold opacity-60">
                    Reconstructed 3D Perspective
                  </p>
                </div>

                {/* 3D Canvas Container */}
                <div className="flex-1 w-full relative">
                  <Canvas />
                </div>

                {/* Footer / Controls */}
                <div className="p-6 bg-white/40 backdrop-blur-sm border-t border-gray-100 flex justify-center gap-6 z-[60]">
                  <CustomButton
                    type="outline"
                    title="← Edit Original JSON"
                    handleClick={handleReset}
                    customStyles="px-8 py-2 rounded-lg font-bold border-2 border-gray-200 text-gray-600 hover:border-blue-500 transition-all"
                  />
                  <CustomButton
                    type="filled"
                    title="Exit to Store"
                    handleClick={handleExit}
                    customStyles="px-8 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-all"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default ReconstructDesign;
