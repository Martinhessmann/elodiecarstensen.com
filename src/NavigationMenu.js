import React from 'react';
import { motion } from 'framer-motion';
import './NavigationMenu.scss';

const NavigationMenu = ({ isOpen, onSelectProject, projects, currentProject }) => {
  const otherProjects = projects.filter(project => project.id !== currentProject?.id);

  return (
    <motion.div
      className={`navigation-menu ${isOpen ? 'open' : ''}`}
      initial={{ y: '-100%' }}
      animate={{ y: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <nav className="navigation-content">
        <ul className="navigation-project-list">
          {otherProjects.map((project) => (
            <li
              key={project.id}
              className="navigation-project-item"
              onClick={() => onSelectProject(project.id)}
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
              <div className="project-circle" />
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default NavigationMenu;
