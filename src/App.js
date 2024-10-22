import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import NavigationMenu from './NavigationMenu';
import Header from './Header';
import data from './data.json';
import './App.scss';

function App() {
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

  const showHeader = location.pathname !== '/';

  return (
    <div className="app" style={{ backgroundColor: currentProject?.themeColor || '#091115' }}>
      {showHeader && (
        <Header
          onLogoClick={() => handleProjectSelect(projects[0]?.id)}
          onTitleClick={toggleMenu}
          project={currentProject}
          isMenuOpen={showMenu}
        />
      )}
      {showMenu && showHeader && (
        <NavigationMenu
          isOpen={showMenu}
          onSelectProject={handleProjectSelect}
          projects={projects}
          currentProject={currentProject}
        />
      )}
      <main className={`main-content ${showHeader ? 'with-header' : ''}`}>
        <Routes>
          <Route path="/" element={<SplashPage onEnter={() => handleProjectSelect(projects[0]?.id)} />} />
          <Route path="/gallery" element={<Gallery project={currentProject} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
