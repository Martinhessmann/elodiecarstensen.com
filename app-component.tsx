import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import Gallery from './components/Gallery';
import NavigationMenu from './components/NavigationMenu';

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <Router>
      <div className="app">
        <NavigationMenu 
          isOpen={showMenu} 
          onClose={toggleMenu} 
          onSelectProject={setCurrentProject}
        />
        <Switch>
          <Route exact path="/">
            <SplashPage onEnter={() => setCurrentProject('project1')} />
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
