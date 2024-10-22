import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import './Header.scss';

const Header = ({ project, projects, onProjectSelect }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProjectClick = (projectId) => {
    onProjectSelect(projectId);
    setIsHovering(false);
    if (projectId === 'contact') {
      navigate('/contact');
    } else {
      navigate('/gallery');
    }
  };

  const isContactActive = location.pathname === '/contact';

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
          className="header-project-menu"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className={`current-project ${isContactActive && project.id === 'contact' ? 'active' : ''}`}>
            <span className="project-name">{project.name}</span>
            {project.season && (
              <>
                <span className="project-separator">/</span>
                <span className="project-season">{project.season}</span>
              </>
            )}
          </div>
          <div className="project-options">
            {projects.filter(p => p.id !== project.id).map(p => (
              <div
                key={p.id}
                className={`project-option ${isContactActive && p.id === 'contact' ? 'active' : ''}`}
                onClick={() => handleProjectClick(p.id)}
              >
                <span className="project-name">{p.name}</span>
                {p.season && (
                  <>
                    <span className="project-separator">/</span>
                    <span className="project-season">{p.season}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
