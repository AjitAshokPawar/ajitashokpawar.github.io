import { combineReducers } from "redux"
import chessReducer from "./chessReducer"
import primeReducer from "./primeReducer"
import optimist from 'redux-optimist';

export default optimist(combineReducers({
    chess: chessReducer,
    primeSpace: primeReducer
}));