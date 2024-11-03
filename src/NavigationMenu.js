import React from 'react';
import { motion } from 'framer-motion';
import './NavigationMenu.scss';

const NavigationMenu = ({ isOpen, onSelectProject, projects, currentProject }) => {
  const otherProjects = projects.filter(project => project.id !== currentProject?.id);

  return (
    <motion.div
      className={`navigation-menu ${isOpen ? 'open' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <nav className="navigation-content" aria-label="Project navigation">
        <div className="menu-header">
          <div className="menu-title">
            <span className="system-id">ID://PRJ-24839</span>
            <span className="title-text">PROJECT INDEX</span>
          </div>
          <div className="header-line" />
        </div>
        <ul className="navigation-project-list">
          {otherProjects.map((project, index) => (
            <motion.li
              key={project.id}
              className="navigation-project-item"
              onClick={() => onSelectProject(project.id)}
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectProject(project.id);
                }
              }}
            >
              <div className="project-connector" />
              <div className="project-title">
                <div className="project-id">{`PRJ${String(index + 1).padStart(2, '0')}`}</div>
                <span className="project-name">{project.name}</span>
                {project.season && (
                  <>
                    <span className="project-separator">//</span>
                    <span className="project-season">{project.season}</span>
                  </>
                )}
              </div>
              <div className="project-status">AVAILABLE</div>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default NavigationMenu;
