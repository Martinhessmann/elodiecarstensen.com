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
    if (data.projects.length > 0 && !currentProject) {
      setCurrentProject(data.projects[0]);
    }
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleProjectSelect = (projectId) => {
    const selected = projects.find(p => p.id === projectId);
    setCurrentProject(selected);
    setShowMenu(false);
  };

  const handleHeaderClick = () => {
    if (!showMenu) {
      setShowMenu(true);
    }
  };

  const showHeader = location.pathname !== '/';

  return (
    <div className="app">
      <Header
        onLogoClick={toggleMenu}
        onTitleClick={toggleMenu}
        project={currentProject}
        isMenuOpen={showMenu}
      />
      {showMenu && (
        <NavigationMenu
          isOpen={showMenu}
          onSelectProject={handleProjectSelect}
          projects={projects}
          currentProject={currentProject}
        />
      )}
      <main className={`main-content ${showHeader ? 'with-header' : ''}`}>
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
