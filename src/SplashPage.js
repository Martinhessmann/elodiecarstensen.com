import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import './SplashPage.css';

const SplashPage = ({ onEnter }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const splashUrl = getAssetUrl('splash.jpg');
  const navigate = useNavigate();

  useEffect(() => {
    onEnter();
  }, []);

  const handleEnter = () => {
    navigate('/gallery');
  };

  return (
    <div className="relative h-screen w-full overflow-x-auto">
      <div className="absolute w-[300vw] h-full" style={{ backgroundImage: `url(${splashUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="relative h-full w-screen">
          <img src={logoUrl} alt="Elodie Carstensen Logo" className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16" />
          <h1 className="absolute top-24 left-1/2 transform -translate-x-1/2 text-white text-3xl font-mono tracking-wider">ELODIE CARSTENSEN</h1>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-[70vh] border border-white">
            <img src={splashUrl} alt="Model" className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-xs font-mono bg-black bg-opacity-50">
              <p>
                STEP INTO A WORLD WHERE VULNERABILITY BECOMES ARMOR AND FLUIDITY DEFIES SOCIETAL CONSTRUCTS. ELODIE CARSTENSEN INVITES YOU TO EXPLORE ABSENCE OF PROMISED SAFETY, A SPACE WHERE CREATURES, ARTIFACTS, AND DESIGNS COALESCE, EACH PIECE CHALLENGING THE CONVENTIONS OF IDENTITY AND STRENGTH.
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleEnter}
            className="splash-enter-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ENTER /
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
