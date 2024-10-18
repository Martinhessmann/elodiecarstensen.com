import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from './assetUtils';

const Header = ({ onLogoClick }) => {
  const logoUrl = getAssetUrl('logo.svg');

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 flex justify-between items-center p-5 bg-black bg-opacity-50 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <img
        src={logoUrl}
        alt="Elodie Carstensen Logo"
        className="w-12 h-12 cursor-pointer"
        onClick={onLogoClick}
      />
      <h1 className="text-white text-2xl font-mono">ELODIE CARSTENSEN</h1>
    </motion.header>
  );
};

export default Header;
