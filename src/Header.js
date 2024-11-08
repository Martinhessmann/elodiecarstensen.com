import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
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

  // Sort projects chronologically by season
  const sortedProjects = [...projects].sort((a, b) => {
    const seasonA = parseInt(a.season?.replace('SS', '') || '0');
    const seasonB = parseInt(b.season?.replace('SS', '') || '0');
    return seasonB - seasonA; // Descending order (newest first)
  });

  const isAboutActive = location.pathname === '/about';

  return (
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
      </div>
      {project && (
        <div
          className={`header-project-menu ${isMenuOpen ? 'open' : ''}`}
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          role="navigation"
          aria-label="Project navigation"
        >
          <button
            className={`current-project ${isAboutActive && project.id === 'contact' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="project-menu"
            aria-label="Toggle project menu"
          >
            <span className="project-name">{project.name}</span>
            {project.season && (
              <>
                <span className="project-separator">/</span>
                <span className="project-season">{project.season}</span>
              </>
            )}
            <span className="menu-indicator" aria-hidden="true">
              {['absence-of-promised-safety', 'des-nachtmahrs-schmetterlinge', 'alluvial', 'about'].map((pageId) => (
                <span
                  key={pageId}
                  className={`dot ${project.id === pageId ? 'active' : ''}`}
                />
              ))}
            </span>
          </button>
          <div
            id="project-menu"
            className={`project-options ${isMenuOpen ? 'open' : ''}`}
            role="menu"
          >
            {sortedProjects
              .filter(p => p.id !== project.id)
              .map(p => (
                <button
                  key={p.id}
                  className={`project-option ${isAboutActive && p.id === 'contact' ? 'active' : ''}`}
                  onClick={() => handleProjectClick(p.id)}
                  role="menuitem"
                >
                  <span className="project-name">{p.name}</span>
                  {p.season && (
                    <>
                      <span className="project-separator">/</span>
                      <span className="project-season">{p.season}</span>
                    </>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
