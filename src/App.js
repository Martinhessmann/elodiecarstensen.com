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

    // Function to set the current project based on the URL
    const setCurrentProjectFromUrl = () => {
      const projectId = location.pathname.split('/').pop();
      if (projectId === 'contact') {
        setCurrentProject(data.contact);
      } else if (projectId !== '' && projectId !== 'gallery') {
        const project = allProjects.find(p => p.id === projectId);
        if (project) {
          setCurrentProject(project);
        } else {
          // If no matching project is found, set the first project as current
          setCurrentProject(allProjects.find(p => p.id !== 'contact') || null);
        }
      } else if (allProjects.length > 0) {
        // Set the first non-contact project as default
        setCurrentProject(allProjects.find(p => p.id !== 'contact') || null);
      }
    };

    setCurrentProjectFromUrl();
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
          <Route path="/contact" element={<ContactPage data={data.contact} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
