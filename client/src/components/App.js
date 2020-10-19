import React from 'react';
import Landing from './landing/Landing'
import Dashboard from './dashboard/Dashboard'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {Provider as ReduxProvider} from 'react-redux'
import store from '../store'

function App() {
  return (
    <ReduxProvider store={store}>
    <Router>
      <div className="App">
        <Switch>
        <Route path="/" component={Landing} />
        <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
    </ReduxProvider>
  );
}

export default App;
