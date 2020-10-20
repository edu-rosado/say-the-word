import rootReducer from './reducers'
import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import { LOCAL_STORAGE_KEY } from './components/App';

const middleware = [thunk]
const store = createStore(rootReducer,
    composeWithDevTools(applyMiddleware(...middleware)))

store.subscribe(throttle(()=>{
    // console.log("subscription called")
    if (store.getState().user.token !== null){
        // console.log("stringify called")
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(store.getState().user)
        )   
    }
}), 1000) // backup period >= 1s

export default store;