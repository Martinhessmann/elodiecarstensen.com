import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from './assetUtils';
import './Header.scss';

const Header = ({ onLogoClick, onHeaderClick, project, isMenuOpen }) => {
  const logoUrl = getAssetUrl('logo.svg');

  return (
    <motion.header
      className={`header ${isMenuOpen ? 'menu-open' : ''}`}
      onClick={onHeaderClick}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <img
        src={logoUrl}
        alt="Elodie Carstensen Logo"
        className="header-logo"
        onClick={(e) => {
          e.stopPropagation();
          onLogoClick();
        }}
      />
      {!isMenuOpen && project && (
        <div className="header-project-title">
          <span className="project-name">{project.name}</span>
          {project.season && (
            <>
              <span className="project-separator">/</span>
              <span className="project-season">{project.season}</span>
            </>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default Header;
