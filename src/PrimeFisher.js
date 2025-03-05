import { canMove, makeMove, PlayersTurn } from './Game';
import { connect } from "react-redux";
import { getBranchStateAsTree, goToSpecificAction } from 'redux-branchable';
import { getCurrentHistoryAsArray } from './Constants';
import { primeMoveAction, primeEnPassantAction, primePromotion, primeCastling } from "./actions/chessAction"


export function primeFishMove(store){
    console.log(store);  
    let primeStore = store.currentState.primeSpace;
    store.dispatch(primeMoveAction(10, 3, [0,0], [3,3]));
 //   if(canMove()){
 //       makeMove();
 //   }
}