import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import ContactPage from './ContactPage';
import Header from './Header';
import data from './data.json';
import './App.scss';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const allProjects = [...data.projects, data.contact];
    setProjects(allProjects);

    // Set the current project based on the current route
    if (location.pathname === '/contact') {
      setCurrentProject(data.contact);
    } else if (location.pathname === '/gallery' && allProjects.length > 0) {
      setCurrentProject(allProjects[0]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentProject) {
      document.documentElement.style.setProperty('--project-theme-color', currentProject.themeColor);
    }
  }, [currentProject]);

  const handleProjectSelect = (projectId) => {
    const selected = projects.find(p => p.id === projectId);
    setCurrentProject(selected);
  };

  const showHeader = location.pathname !== '/' && currentProject !== null;

  return (
    <div className="app" style={{ backgroundColor: currentProject?.themeColor || '#091115' }}>
      {showHeader && (
        <Header
          project={currentProject}
          projects={projects}
          onProjectSelect={handleProjectSelect}
        />
      )}
      <main className={`main-content ${showHeader ? 'with-header' : ''}`}>
        <Routes>
          <Route path="/" element={<SplashPage onEnter={() => handleProjectSelect(projects[0]?.id)} />} />
          <Route
            path="/gallery"
            element={
              currentProject && currentProject.id !== 'contact'
                ? <Gallery project={currentProject} />
                : <Navigate to="/contact" replace />
            }
          />
          <Route path="/contact" element={<ContactPage data={data.contact} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
