import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import './SplashPage.css';

const SplashPage = ({ onEnter }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const splashUrl = getAssetUrl('splash.jpg');
  const navigate = useNavigate();

  const handleEnter = () => {
    onEnter();
    navigate('/gallery');
  };

  return (
    <div className="splash-container">
      <div className="splash-scroll-container">
        <div className="splash-background">
          <div
            className="splash-background-image"
            style={{ backgroundImage: `url(${splashUrl})` }}
          ></div>
        </div>
      </div>
      <div className="splash-glass-effect"></div>
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
