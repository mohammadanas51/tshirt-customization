import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader, downloadDesignJSON } from '../config/helpers';
import { EditorTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { ColorPicker, CustomButton, FilePicker, Tab, TextPicker } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  const [file, setFile] = useState('');

  const [activeEditorTab, setActiveEditorTab] = useState("");


  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "textpicker":
        return <TextPicker />
      default:
        return null;
    }
  }

  const handleDecals = (type, result) => {
    const isBack = type.toLowerCase().includes('back');
    const isLogo = type.toLowerCase().includes('logo');

    const newDecal = {
      id: Date.now().toString(),
      type: isLogo ? 'logo' : 'text',
      content: result,
      // Apply a small random offset so multiple decals don't overlap perfectly
      position: isBack
        ? [Math.random() * 0.1 - 0.05, 0.04, -0.15]
        : [Math.random() * 0.1 - 0.05, 0.04, 0.15],
      rotation: isBack ? [0, Math.PI, 0] : [0, 0, 0],
      scale: isLogo ? 0.15 : 0.3,
      side: isBack ? 'back' : 'front',
      color: state.color
    };

    state.decals.push(newDecal);
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const tabContainerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabContainerRef.current && !tabContainerRef.current.contains(event.target)) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div
                ref={tabContainerRef}
                className="editortabs-container tabs"
              >
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5 flex flex-col gap-3"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Export Design JSON"
              handleClick={() => downloadDesignJSON(snap)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm shadow-lg border border-white/20"
              color="#00A8FF"
            />
            <CustomButton
              type="filled"
              title="Visualize Design"
              handleClick={() => navigate('/reconstructDesign')}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm shadow-lg border border-white/20"
              color="#00A8FF"
            />
          </motion.div>

        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer