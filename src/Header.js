import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import NavigationMenu from './NavigationMenu';
import './Header.scss';

const Header = ({ project, projects, onProjectSelect }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProjectClick = (projectId) => {
    onProjectSelect(projectId);
    setIsMenuOpen(false);
    if (projectId === 'about') {
      navigate('/about');
    } else {
      navigate(`/gallery/${projectId}`);
    }
  };

  const isAboutActive = location.pathname === '/about';

  return (
    <>
      <motion.header
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="header-logo-container">
          <img
            src={logoUrl}
            alt="Elodie Carstensen Logo"
            className="header-logo"
            onClick={handleLogoClick}
          />
          <div className="logo-status">
            EC-SYSTEM
          </div>
        </div>
        {project && (
          <div
            className="header-project-trigger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`current-project ${isAboutActive && project.id === 'contact' ? 'active' : ''}`}>
              <span className="project-name">{project.name}</span>
              {project.season && (
                <>
                  <span className="project-separator">/</span>
                  <span className="project-season">{project.season}</span>
                </>
              )}
            </div>
          </div>
        )}
      </motion.header>
      <NavigationMenu
        isOpen={isMenuOpen}
        onSelectProject={handleProjectClick}
        projects={projects}
        currentProject={project}
      />
    </>
  );
};

export default Header;
