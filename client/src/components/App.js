import React from 'react';
import Landing from './landing/Landing'
import ChatDashboard from './chat/Dashboard'
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

import {Provider as ReduxProvider} from 'react-redux'
import store from '../store'
import { useEffect } from 'react';
import { rehydrateUser } from '../actions/userActions';


export const LOCAL_STORAGE_KEY = "say-the-word-user"

function App() {  

  useEffect(()=>{
    const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (jsonData !== null){ 
      const user = JSON.parse(jsonData)
      store.dispatch(rehydrateUser(user))
    }
  },[])
  
  return (
    <ReduxProvider store={store}>
    <Router>
      <div className="App">
        <Switch>
          <PrivateRoute path="/chat" component={ChatDashboard} />
          <RestrictedRoute path="/" component={Landing} />
        </Switch>
      </div>
    </Router>
    </ReduxProvider>
  );
}

export default App;
