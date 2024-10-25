import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import AboutPage from './AboutPage';
import Header from './Header';
import { loadProjects } from './utils/dataLoader';
import './App.scss';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const projectsData = await loadProjects();
      setProjects(projectsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentProject) {
      document.documentElement.style.setProperty('--project-theme-color', currentProject.themeColor);
    }
  }, [currentProject]);

  const handleProjectSelect = (projectId) => {
    const selected = projects.find(p => p.id === projectId);
    setCurrentProject(selected);
  };

  const showHeader = location.pathname !== '/';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app" style={{ backgroundColor: currentProject?.themeColor || '#091115' }}>
      {showHeader && (
        <Header
          project={currentProject || projects.find(p => p.id === 'about')}
          projects={projects}
          onProjectSelect={handleProjectSelect}
        />
      )}
      <main className={`main-content ${showHeader ? 'with-header' : ''}`}>
        <Routes>
          <Route path="/" element={<SplashPage onEnter={() => handleProjectSelect(projects[0]?.id)} />} />
          <Route
            path="/gallery"
            element={projects.length > 0 ? <Navigate to={`/gallery/${projects[0]?.id}`} replace /> : null}
          />
          <Route
            path="/gallery/:projectId"
            element={
              <Gallery
                projects={projects}
                currentProject={currentProject}
                setCurrentProject={setCurrentProject}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage data={projects.find(p => p.id === 'about')} />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
