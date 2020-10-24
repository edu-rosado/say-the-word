import React from 'react';
import Landing from './landing/Landing'
import ChatDashboard from './chat/Dashboard'
import {BrowserRouter as Router, Switch, useHistory} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute';

import {Provider as ReduxProvider} from 'react-redux'
import store from '../store'
import { useEffect } from 'react';
import { logoutUser, rehydrateUser } from '../actions/userActions';
import { getGames } from '../actions/gameActions';
import { connectToSocket } from '../actions/aux';

export const LOCAL_STORAGE_KEY = "say-the-name-user"

function App() {  

  // useEffect(()=>{
  //   const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY)
  //   let socket = null;
  //   if (jsonData !== null){ 
  //     const user = JSON.parse(jsonData)
  //     store.dispatch(rehydrateUser(user))
  //     socket = connectToSocket(5001, user.username, user.isGuest)
  //     store.dispatch(socket)   
  //   }
  //   return ()=>{
  //     if (socket) {
  //       try {socket.close()}
  //       catch{}// It is already closed
  //     }
  //   }
  // },[])
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
