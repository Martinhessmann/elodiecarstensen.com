import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import './SplashPage.scss';

const SplashPage = ({ onEnter }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const splashUrl = getAssetUrl('splash.jpg');
  const navigate = useNavigate();

  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
      navigate('/gallery');
    }, 500);
  };

  return (
    <div className="splash-container">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id="splash-mask">
            <rect width="100%" height="100%" fill="black" />
            <rect x="calc(50% - 45.865px)" y="20%" width="91.73px" height="60%" fill="white" />
          </mask>
        </defs>
      </svg>

      <div className="splash-background"
        style={{ backgroundImage: `url(${splashUrl})` }}
      />
      <div className={`splash-glass-effect ${isEntering ? 'entering' : ''}`} />
      <div className="splash-content">
        <div className="splash-logo-name">
          <img src={logoUrl} alt="Logo" className="splash-logo" />
          <h1 className="splash-title">ELODIE CARSTENSEN</h1>
        </div>
        <p className="splash-intro-text">
          STEP INTO A WORLD WHERE VULNERABILITY BECOMES ARMOR AND FLUIDITY DEFIES SOCIETAL CONSTRUCTS. ELODIE CARSTENSEN INVITES YOU TO EXPLORE ABSENCE OF PROMISED SAFETY, A SPACE WHERE CREATURES, ARTIFACTS, AND DESIGNS COALESCE, EACH PIECE CHALLENGING THE CONVENTIONS OF IDENTITY AND STRENGTH.
        </p>
        <motion.button
          className="splash-enter-button"
          onClick={handleEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </div>
    </div>
  );
};

export default SplashPage;
