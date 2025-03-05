import React, { Component } from 'react';
import { TYPES, COLORS, getColor, getType, getCurrentHistoryAsArray, getCoordinats } from './Constants';
import {goToSpecificAction, getBranchStateAsTree} from 'redux-branchable';

export default class History extends Component {
    renderHistoryPost(counter, branchIndex, actionIndex, move){
        const bColor = counter % 2 === 0 ? 'lightgrey' : 'white';
       return (<li  key={counter}
                    style={{backgroundColor: bColor, cursor:'pointer'}}
                    onClick={() => handleHistoryClick(branchIndex, actionIndex, this.props.goToSpecificAction)}> 
                    <div style={{fontSize:'20px', fontFamily: 'monospace'}}> 
                        {renderPiece(move.piece)} {indexToChessNotation(move.moveFrom)} {indexToChessNotation(move.moveTo)} 
                    </div> 
                </li>);
    }

    render(){    
    const histories = [];
    var tree = getBranchStateAsTree(this.props.store.branches);
    var historyArray = [];
    historyArray = getCurrentHistoryAsArray(tree, historyArray);
    
    for(let i = 0; i<historyArray.length; i++){
        histories.push(this.renderHistoryPost(i+1, historyArray[i].branch, historyArray[i].depth, historyArray[i].action));
    }

      return (<div>
                  <h2>History</h2>
                  <ol style={{width: '8em'}}>
                      {histories}
                   </ol>
              </div>);
    };
}

function handleHistoryClick(branchIndex, actionIndex, goToSpecificAction) {
    //I can do things if you click the history
    goToSpecificAction(branchIndex, actionIndex);
}

function renderPiece(piece){
        const type = getType(piece);
        const color = getColor(piece);
        const whiteplayer = color === COLORS.WHITE;

        switch (type) {
            case TYPES.PAWN: {
                return whiteplayer ? '♙' : '♟';
            }
            case TYPES.BISHOP: {
                return whiteplayer ? '♗' : '♝';
            }
            case TYPES.KNIGHT: {
                return whiteplayer ? '♘' : '♞';
            }
            case TYPES.QUEEN: {
                return whiteplayer ? '♕' : '♛';
            }
            case TYPES.KING: {
                return whiteplayer ? '♔' : '♚';
            }
            case TYPES.ROOK: {
                return whiteplayer ? '♖' : '♜';
            }
            default: return null;
        }        
}

function indexToChessNotation(index){
    if(index === undefined){
        return "Start";
    }

    const [col, row] = getCoordinats(index);       
    let letter;
        switch (col) {
            case 0: {
                letter = 'a';
                break;
            }
            case 1: {
                letter = 'b';
                break;
            }
            case 2: {
                letter = 'c';
                break;
            }
            case 3: {
                letter = 'd';
                break;
            }
            case 4: {
                letter = 'e';
                break;
            }
            case 5: {
                letter = 'f';
                break;
            }
            case 6: {
                letter = 'g';
                break;
            }
            case 7: {
                letter = 'h';
                break;
            }
            default: letter = null;
        }  


    return [letter, row+1];
}