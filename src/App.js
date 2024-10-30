import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import SplashPage from './SplashPage';
import Gallery from './Gallery';
import AboutPage from './AboutPage';
import Header from './Header';
import NotFound from './NotFound';
import { loadProjects } from './utils/dataLoader';
import { initViewportHeight } from './utils/viewportHeight';
import './App.scss';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Elodie Carstensen",
    "url": "https://www.elodiecarstensen.com",
    "jobTitle": "Fashion Designer & Artist",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Berlin",
      "addressCountry": "DE"
    },
    "description": "Berlin-based artist and designer creating immersive fashion experiences through collections, installations, and performances.",
    "image": "https://www.elodiecarstensen.com/assets/images/social-preview.jpg",
    "sameAs": [
      "https://www.instagram.com/elodiecarstensen/",
      // Add other social media URLs
    ]
  };

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

  useEffect(() => {
    initViewportHeight();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/work/')) {
      const projectId = location.pathname.split('/').pop();
      navigate(`/gallery/${projectId}`, { replace: true });
    }
  }, [location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container" style={{ backgroundColor: currentProject?.themeColor || '#091115' }}>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
