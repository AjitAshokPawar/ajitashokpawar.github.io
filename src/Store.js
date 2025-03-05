import { applyMiddleware, createStore } from "redux"
import reducer from "./reducers"
import {createBranchableReducer} from 'redux-branchable'
import { primeFishMove } from './PrimeFisher'

const logger = (store) => (next) => (action) => {
    console.log("action fired ", action);
    return next(action);
}

const error = (store) => (next) => (action) => {
    try{
        next(action);
    }
    catch(e){
    console.log(e);
    }
}

const middleware = applyMiddleware(logger, error);
const store = createStore(createBranchableReducer(reducer), middleware);

function handleChange() {
  let currentState = store.getState();
  primeFishMove(currentState);
}

let unsubscribe = store.subscribe(handleChange)

export default store;


//store.subscribe(() => {console.log("store changed ", store.getState())});

//store.dispatch({type: "INC", payload: 1});