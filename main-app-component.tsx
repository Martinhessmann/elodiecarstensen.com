import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import Gallery from './components/Gallery';
import NavigationMenu from './components/NavigationMenu';
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
        <Switch>
          <Route exact path="/">
            <SplashPage onEnter={() => handleProjectSelect(projects[0]?.id)} />
          </Route>
          <Route path="/gallery">
            <Gallery 
              project={currentProject} 
              onLogoClick={toggleMenu}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
