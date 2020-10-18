import React from 'react';
import Login from './Login'
import Dashboard from './dashboard/Dashboard'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <Route path="/tmp" component={Login} />
        <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
