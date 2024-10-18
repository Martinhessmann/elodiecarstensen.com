import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from './assetUtils';
import './Header.css';

const Header = ({ onLogoClick }) => {
  const logoUrl = getAssetUrl('logo.svg');

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <img
        src={logoUrl}
        alt="Elodie Carstensen Logo"
        className="header-logo"
        onClick={onLogoClick}
      />
      <h1 className="header-title">ELODIE CARSTENSEN</h1>
    </motion.header>
  );
};

export default Header;
