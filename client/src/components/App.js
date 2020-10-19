import React from 'react';
import Landing from './landing/Landing'
import Dashboard from './dashboard/Dashboard'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <Route path="/" component={Landing} />
        <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
