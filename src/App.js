import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import NavigationMenu from './NavigationMenu';
import Header from './Header';
import data from './data.json';
import './App.scss';

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const location = useLocation();

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

  const showHeader = location.pathname !== '/';

  return (
    <div className="app">
      {showHeader && (
        <Header
          onLogoClick={toggleMenu}
          projectName={currentProject?.name}
        />
      )}
      <NavigationMenu
        isOpen={showMenu}
        onClose={toggleMenu}
        onSelectProject={handleProjectSelect}
      />
      <main className={showHeader ? "main-content with-header" : "main-content"}>
        <Routes>
          <Route path="/" element={
            <SplashPage
              onEnter={() => handleProjectSelect(projects[0]?.id)}
            />
          } />
          <Route path="/gallery" element={
            <Gallery
              project={currentProject}
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
