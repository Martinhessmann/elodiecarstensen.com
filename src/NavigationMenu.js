import React from 'react';
import { motion } from 'framer-motion';

const NavigationMenu = ({ isOpen, onClose, onSelectProject, projects }) => {
  return (
    <motion.div
      className="fixed inset-y-0 left-0 w-64 bg-black text-white p-5 z-20"
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button onClick={onClose} className="absolute top-5 right-5">X</button>
      <h2 className="text-xl mb-5">Projects</h2>
      {projects.map((project) => (
        <div
          key={project.id}
          className="mb-3 cursor-pointer hover:text-gray-300"
          onClick={() => {
            onSelectProject(project.id);
            onClose();
          }}
        >
          <h3>{project.name}</h3>
          <p className="text-sm text-gray-400">{project.images.length} images</p>
        </div>
      ))}
    </motion.div>
  );
};

export default NavigationMenu;
