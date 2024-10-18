import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as CloseIcon } from './assets/close-icon.svg';
import './NavigationMenu.scss';

const NavigationMenu = ({ isOpen, onClose, onSelectProject, projects, currentProject }) => {
  return (
    <motion.div
      className={`navigation-menu ${isOpen ? 'open' : ''}`}
      initial={{ y: '-100%' }}
      animate={{ y: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <nav className="navigation-content">
        <ul className="navigation-project-list">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className={`navigation-project-item ${project.id === currentProject?.id ? 'active' : ''}`}
              onClick={() => project.id !== currentProject?.id && onSelectProject(project.id)}
            >
              <div className="project-title">
                <span className="project-name">{project.name}</span>
                {project.season && (
                  <>
                    <span className="project-separator">/</span>
                    <span className="project-season">{project.season}</span>
                  </>
                )}
              </div>
              <AnimatePresence>
                {(isOpen || project.id !== currentProject?.id) && (
                  <motion.div
                    className="project-circle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
      <button className="navigation-close-button" onClick={onClose}>
        <CloseIcon />
      </button>
    </motion.div>
  );
};

export default NavigationMenu;
