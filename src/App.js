import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board.js';
import History from './History.js';
import { connect } from "react-redux";
import { getBranchStateAsTree, goToSpecificAction } from 'redux-branchable';
import { getCurrentHistoryAsArray, COLORS } from './Constants';
import { moveAction, enPassantAction, promotion, castling } from "./actions/chessAction"


class App extends Component {
  componentWillMount(){
    
  }

  render() {
    console.log(this.props);
    return (
      <div className="App">
        <div className="App-header"> <div style={{fontSize: '3em', display: 'inline-block', position: 'relative', top: '-20px'}}>PRIME CHESS</div> <img src={logo} className="App-logo" alt="logo" /> </div>             
        <div style={{width: '50%', float: 'left'}}>
          <Board board={this.props.board} move={this.props.move} enPassant={this.props.enPassant} promotion={this.props.promotion} castling={this.props.castling} history={this.props.history}/>
        </div>
        <div style={{width: '50%', float: 'right'}}>
          <History store={this.props.store} goToSpecificAction={this.props.goToSpecificAction}/>
        </div>
      </div>
    );
  }
}

export default connect(store => {
    const tree = getBranchStateAsTree(store.branches);
    let history = [];
    history = getCurrentHistoryAsArray(tree, history)
 
  return {
    board: store.currentState.chess.board,
    store: store,
    history: history
  };
}, dispatch => {
  return {
    move: (piece, color, moveFrom, moveTo) => dispatch(moveAction(piece, color, moveFrom, moveTo)),
    enPassant: (piece, color, moveFrom, moveTo, emptySquare) => dispatch(enPassantAction(piece, color, moveFrom, moveTo, emptySquare)),
    promotion: (piece, color, moveFrom, moveTo) => dispatch(promotion(piece, color, moveFrom, moveTo)),
    castling: (king, rook, color, moveKingFrom, moveKingTo, moveRookFrom, moveRookTo) => dispatch(castling(king, rook, color, moveKingFrom, moveKingTo, moveRookFrom, moveRookTo)),
    goToSpecificAction: (branchIndex, actionIndex) => dispatch(goToSpecificAction(branchIndex, actionIndex))
  }
})(App);