import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from './assetUtils';
import './Header.scss';

const Header = ({ onLogoClick, projectName }) => {
  const logoUrl = getAssetUrl('logo.svg');

  return (
    <motion.header
      className="header"
      onClick={onLogoClick}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <img
        src={logoUrl}
        alt="Elodie Carstensen Logo"
        className="header-logo"
      />
      {projectName && <div className="header-project-name">{projectName}</div>}
    </motion.header>
  );
};

export default Header;
