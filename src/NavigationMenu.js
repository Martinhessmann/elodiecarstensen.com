import React from 'react';
import { motion } from 'framer-motion';
import data from './data.json';
import './NavigationMenu.scss';

const NavigationMenu = ({ isOpen, onClose, onSelectProject }) => {
  const menuVariants = {
    closed: { x: '-100%' },
    open: { x: 0 },
  };

  return (
    <motion.nav
      className="navigation-menu"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button className="navigation-close-button" onClick={onClose}>X</button>
      <ul className="navigation-project-list">
        {data.projects.map((project) => (
          <li
            key={project.id}
            className="navigation-project-item"
            onClick={() => onSelectProject(project.id)}
          >
            <h3>{project.name}</h3>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default NavigationMenu;
