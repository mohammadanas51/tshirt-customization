import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import ReconstructDesign from './pages/ReconstructDesign';

const MainApp = () => {
  return (
    <>
      <Home />
      <Canvas />
      <Customizer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <main className="app transition-all ease-in">
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/reconstructDesign" element={
            <ReconstructDesign />
          } />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
