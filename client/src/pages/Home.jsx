import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';

import state from '../store';
import { CustomButton } from '../components';
import { downloadDesignJSON } from '../config/helpers';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation("down")}>
            <img 
              src='./threejs.png'
              alt="logo"
              className="w-8 h-8 object-contain"
            />
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                IT'S <br className="xl:block hidden" /> YOURS.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-gray-600 text-base">
              Customize your T-shirt the way you want. <strong>Unleash your imagination</strong>{" "} and define your own style.
              </p>

              <div className="flex flex-col gap-4 w-fit">
                <CustomButton 
                  type="filled"
                  title="Customize It"
                  handleClick={() => state.intro = false}
                  customStyles="w-full px-8 py-3 font-bold text-sm shadow-md"
                />

                <CustomButton 
                  type="outline"
                  title="Export Design JSON"
                  handleClick={() => downloadDesignJSON(snap)}
                  customStyles="w-full px-8 py-3 font-bold text-sm border-gray-400"
                />

                <CustomButton 
                  type="outline"
                  title="Visualize Design"
                  handleClick={() => navigate('/reconstructDesign')}
                  customStyles="w-full px-8 py-3 font-bold text-sm border-blue-400 text-blue-600"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home