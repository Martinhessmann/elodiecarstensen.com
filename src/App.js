import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import NavigationMenu from './NavigationMenu';
import data from './data.json';

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(data.projects);
    setCurrentProject(data.projects[0]);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleProjectSelect = (projectId) => {
    const selected = projects.find(p => p.id === projectId);
    setCurrentProject(selected);
    setShowMenu(false);
  };

  return (
    <Router>
      <div className="app">
        <NavigationMenu
          isOpen={showMenu}
          onClose={toggleMenu}
          onSelectProject={handleProjectSelect}
          projects={projects}
        />
        <Routes>
          <Route path="/" element={
            <SplashPage onEnter={() => handleProjectSelect(projects[0]?.id)} />
          } />
          <Route path="/gallery" element={
            <Gallery
              project={currentProject}
              onLogoClick={toggleMenu}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;