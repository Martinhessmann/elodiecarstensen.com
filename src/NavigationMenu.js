import React from 'react';
import { motion } from 'framer-motion';
import data from './data.json';

const NavigationMenu = ({ isOpen, onClose, onSelectProject }) => {
  const menuVariants = {
    closed: { x: '-100%' },
    open: { x: 0 },
  };

  return (
    <motion.nav
      className="fixed inset-y-0 left-0 w-64 bg-black text-white p-5 z-20"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '16rem', // 64px
      }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button className="absolute top-5 right-5" onClick={onClose}>X</button>
      <ul className="list-none p-0 mt-16"> {/* Add margin-top to account for header */}
        {data.projects.map((project) => (
          <li
            key={project.id}
            className="mb-3 cursor-pointer hover:text-gray-300"
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
