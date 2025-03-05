import { TYPES, COLORS, getColor, getType, getIndex, getCoordinats, getOpposingColor, combineTypeColor, PLAYERCOLOR } from "./Constants"

export function canMove(piece, color, moveFrom, moveTo, board, moveHistory, onlyCapture = false) {
  if(GetLastMoveColor(moveHistory) === color){
      return false;
  }
  const [fromX, fromY] = moveFrom;
  const [toX, toY] = moveTo;
  const dx = toX - fromX;
  const dy = toY - fromY;

  //Used for checking blocking pieces.
  //You don't want to start on the first square since it would mean it's blocking itself
  let x0 = fromX;
  let y0 = fromY;
  
  if(dx === 0 && dy === 0)
    return false;

  var otherPiece = board[getIndex(moveTo)];
  let otherColor = getColor(otherPiece);
  
  //If it's my own square with exception for castling
  if(otherPiece !== TYPES.EMPTY && otherColor === color) {
    if(canCastle(piece, moveFrom, moveTo, board)){
    }
    else{
        return false;
    }
  }

  

  //if(piece != TYPES.KNIGHT && hasBlockingPiece(fromX, fromY, toX, toY, board))
  //  return false;

  switch(piece){
    case TYPES.KNIGHT:{
        return knightMovement(dx, dy) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    case TYPES.ROOK:{
        return (rookMovement(dx, dy, board) && !hasBlockingPiece(moveFrom, moveTo, board) || canCastle(piece, moveFrom, moveTo, board)) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    case TYPES.KING:{
        return (kingMovement(dx, dy) && !hasBlockingPiece(moveFrom, moveTo, board) || canCastle(piece, moveFrom, moveTo, board)) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    case TYPES.PAWN:{
        return ((pawnMovement(dx, dy, fromY, moveTo, color, board, onlyCapture) && !hasBlockingPiece(moveFrom, moveTo, board)) || enPassant(color, dx, dy, moveFrom, board, moveHistory)) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    case TYPES.QUEEN:{
        return ((rookMovement(dx, dy) || bishopMovement(dx, dy)) && !hasBlockingPiece(moveFrom, moveTo, board)) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    case TYPES.BISHOP:{
        return (bishopMovement(dx, dy) && !hasBlockingPiece(moveFrom, moveTo, board)) && kingCheck(piece, color, moveFrom, moveTo, board);
    }
    default: return false;
  }
}

function kingCheck(piece, color, moveFrom, moveTo, board){
    if(isKingCheck(color, board)){
        let boardPiece =  combineTypeColor(piece, color);
        let nextBoard = makeTempMove(boardPiece, moveTo, moveFrom, board);
        if(isKingCheck(color, nextBoard)){
            return false
        }
        else{
            return true;
        }
    }
    else{
        let boardPiece =  combineTypeColor(piece, color);
        let nextBoard = makeTempMove(boardPiece, moveTo, moveFrom, board);
        if(isKingCheck(color, nextBoard)){
            return false
        }
        else{
            return true;
        }
    }
}

function GetLastMoveColor(history){
    //Since white start we need to return black on the first move
    if(history[history.length -1].action.type === "@@redux/INIT")
        return COLORS.BLACK;
    return getColor(history[history.length -1].action.piece);
}

function knightMovement(dx, dy){
    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
           (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function rookMovement(dx, dy, board, moveFrom, moveTo){
    return (Math.abs(dx) > 0 && Math.abs(dy) === 0) ||
           (Math.abs(dx) === 0 && Math.abs(dy) > 0);
}

function bishopMovement(dx, dy){
    return Math.abs(dx) === Math.abs(dy);
}

function kingMovement(dx, dy){
    return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

function pawnMovement(dx, dy, fromY, moveTo, color, board, onlyCheck){
        var canGo = fromY === 1 || fromY === 6 ? Math.abs(dx) === 0 && Math.abs(dy) <= 2 && movingForward(color, dy) : Math.abs(dx) === 0 && Math.abs(dy) <= 1 && movingForward(color, dy);
        canGo = (canGo && emptySquare(moveTo, board) && !onlyCheck) || canPawnCapture(dx, dy, moveTo, color, board, onlyCheck);  
    return canGo;    
}

function emptySquare(square, board){
    return board[getIndex(square)] === TYPES.EMPTY
}

function canPawnCapture(dx, dy, moveTo, color, board, onlyCheck = false){
    return    ((dx === 1 || dx === -1) 
            && (dy === 1 || dy === -1)
            && ((board[getIndex(moveTo)] !== TYPES.EMPTY && getColor(board[getIndex(moveTo)]) !== color) || onlyCheck)) 
            && movingForward(color, dy);
}

function isKingCheck(color, board){
    let kingCoords = findKing(color, board);
    if(kingCoords === TYPES.EMPTY){
        return true;
    }
    let res = captureAsKnight(kingCoords, color, board) || captureAsQueen(kingCoords, color, board);
    if(res)
        console.log("King is check!");
    return res;
}

/**** MOVE KING AS THE OTHER PIECES TO SEE IF IT IS CHECKED  ****/
function captureAsKnight(kingPos, color, board){
    let [x0, y0] = kingPos;
    let dx1 = 1;
    let dy1 = 1;
    let dx2 = 2;
    let dy2 = 2;

    let m1 = board[getIndex([x0+dx1, y0+dy2])];
    let m2 = board[getIndex([x0-dx1, y0+dy2])];
    let m3 = board[getIndex([x0+dx1, y0-dy2])];
    let m4 = board[getIndex([x0-dx1, y0-dy2])];

    let m5 = board[getIndex([x0+dx2, y0+dy1])];
    let m6 = board[getIndex([x0-dx2, y0+dy1])];
    let m7 = board[getIndex([x0+dx2, y0-dy1])];
    let m8 = board[getIndex([x0-dx2, y0-dy1])];

    if(getType(m1) === TYPES.KNIGHT && getColor(m1) !== color){
        return true;
    }
    else if(getType(m2) === TYPES.KNIGHT && getColor(m2) !== color){
        return true;
    }
    else if(getType(m3) === TYPES.KNIGHT && getColor(m3) !== color){
        return true;
    }
    else if(getType(m4) === TYPES.KNIGHT && getColor(m4) !== color){
        return true;
    }
    else if(getType(m5) === TYPES.KNIGHT && getColor(m5) !== color){
        return true;
    }
    else if(getType(m6) === TYPES.KNIGHT && getColor(m6) !== color){
        return true;
    }
    else if(getType(m7) === TYPES.KNIGHT && getColor(m7) !== color){
        return true;
    }
    else if(getType(m8) === TYPES.KNIGHT && getColor(m8) !== color){
        return true;
    }

    return false;
}

function captureAsQueen(kingCoords, color, board){
    let [x0, y0] = kingCoords;

    //Capture as rook
    let i = 1
    while (x0+i <= 7){
        let piece = board[getIndex([x0+i, y0])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.ROOK && pieceColor !== color){
            return true;
        }
        else {     
             break;
        }
    }
    i = 1;
    while (x0-i >= 0){
        let piece = board[getIndex([x0-i, y0])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.ROOK && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }
    i = 1;
    while (y0+i <= 7){
        let piece = board[getIndex([x0, y0+i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.ROOK && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }
    i = 1;
    while (y0-i >= 0){
        let piece = board[getIndex([x0, y0-i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.ROOK && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }

    //Capture as bishop
    i = 1
    while (x0+i <= 7 && y0+i <=7){
        let piece = board[getIndex([x0+i, y0+i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.BISHOP && pieceColor !== color){
            return true;
        }
        else {     
             break;
        }
    }
    i = 1;
    while (x0-i >= 0 && y0+i <=7){
        let piece = board[getIndex([x0-i, y0+i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.BISHOP && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }
    i = 1;
    while (x0+i <= 7 && y0-i >=0){
        let piece = board[getIndex([x0+i, y0-i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.BISHOP && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }
    i = 1;
    while (x0-i >= 0 && y0-i >= 0){
        let piece = board[getIndex([x0-i, y0-i])];
        let pieceType = getType(piece);
        let pieceColor = getColor(piece);
        
        if(pieceType === TYPES.EMPTY){
            i++;
        }
        else if(pieceType === TYPES.QUEEN && pieceColor !== color){
            return true;
        }
        else if(pieceType === TYPES.BISHOP && pieceColor !== color){
            return true;
        }
        else { 
             break;
        }
    }

    return false;
}

 function makeTempMove(piece, moveTo, moveFrom, board){
     let nextBoard = board.slice();
     nextBoard[getIndex(moveTo)] = piece;
     nextBoard[getIndex(moveFrom)] = TYPES.EMPTY;
     return nextBoard;
 }

function findKing(color, board){
    for(let i=0; i<board.length; i++){
        if(getType(board[i]) === TYPES.KING && getColor(board[i]) === color){
            return getCoordinats(i);
        }
    }
    return TYPES.EMPTY;
}

function canCastle(piece, moveFrom, moveTo, board){
  let whiteRook1 = [0, 0];
  let whiteRook2 = [7, 0];
  let whiteKing = [3, 0];
  
  let blackRook1 = [0, 7];
  let blackRook2 = [7, 7];
  let blackKing = [3, 7];

    if(piece === TYPES.ROOK || piece === TYPES.KING){
        if((   (moveFrom[0] === whiteRook1[0] && moveFrom[1] === whiteRook1[1] && moveTo[0] === whiteKing[0] && moveTo[1] === whiteKing[1]) 
            || (moveFrom[0] === whiteKing[0] && moveFrom[1] === whiteKing[1] && moveTo[0] === whiteRook1[0] && moveTo[1] === whiteRook1[1]) 
            || (moveFrom[0] === whiteKing[0] && moveFrom[1] === whiteKing[1] && moveTo[0] === whiteRook2[0] && moveTo[1] === whiteRook2[1]) 
            || (moveFrom[0] === whiteRook2[0] && moveFrom[1] === whiteRook2[1] && moveTo[0] === whiteKing[0] && moveTo[1] === whiteKing[1])
            || (moveFrom[0] === blackRook1[0] && moveFrom[1] === blackRook1[1] && moveTo[0] === blackKing[0] && moveTo[1] === blackKing[1])
            || (moveFrom[0] === blackKing[0] && moveFrom[1] === blackKing[1] && moveTo[0] === blackRook1[0] && moveTo[1] === blackRook1[1]) 
            || (moveFrom[0] === blackKing[0] && moveFrom[1] === blackKing[1] && moveTo[0] === blackRook2[0] && moveTo[1] === blackRook2[1]) 
            || (moveFrom[0] === blackRook2[0] && moveFrom[1] === blackRook2[1] && moveTo[0] === blackKing[0] && moveTo[1] === blackKing[1])) 
        && !hasBlockingPiece(moveFrom, moveTo, board)){
            let boardPiece = board[getIndex(moveFrom)];
            let pieceColor = getColor(boardPiece);
            let opposingColor = getOpposingColor(pieceColor);
           
            let [x0, y0] = moveFrom;
            let [x1, y1] = moveTo;
            let dx = Math.abs(x1 - x0);
            let i = 1;
            let startSquare = x1 > x0 ? x0 : x1;

            while(i < dx){
                let square = [startSquare + i, y0]
                if(squareChecked(opposingColor, square ,board)){
                    return false;
                }
                i++;
            }
            return true;
        }
    }
    else return false;
}

export function squareChecked(enemyColor, square, board){
    for(let i = 0; i<board.length; i++){
        if(getColor(board[i]) === enemyColor){
            if(canMove(getType(board[i]), getColor(board[i]), getCoordinats(i), square, board, null, true)){
                //const sq = getCoordinats(i);
                //alert("Square: [" + sq[0] + ", " + sq[1] + "]" + " is checking!")//return true;
                return true;
            }
        }
    }
    return false;
    
}

function enPassant(color, dx, dy, moveFrom, board, moveHistory){
    if((dx === 1 || dx === -1) && (dy === 1 || dy === -1) && movingForward(color, dy)){
        let enemyColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
        if(dx === -1 && enemyPawnLeft(enemyColor, moveFrom, board)){
            const [x, y] = moveFrom;
            if(pawnMovedTwoStepsLastTurn(moveHistory, [x-1, y])){
                return true;
            }
        }
        if(dx === 1 && enemyPawnRight(enemyColor, moveFrom, board)){
            const [x, y] = moveFrom;
            if(pawnMovedTwoStepsLastTurn(moveHistory, [x+1, y])){
                return true;
            }
        }
    }
    return false;
}

function enemyPawnLeft(enemyColor, moveFrom, board){
    let [x, y] = moveFrom;
    let squareLeftCoord = x > 0 ? [x-1, y] : null;
    if(squareLeftCoord !== null){
        let squareLeft = board[getIndex(squareLeftCoord)]
        if(squareLeft !== TYPES.EMPTY && enemyColor === getColor(squareLeft) && TYPES.PAWN === getType(squareLeft)){
            return true;
        }
    }
    return false;
}

function pawnMovedTwoStepsLastTurn(moveHistory, pawnPos){
    let lastMove = moveHistory[moveHistory.length-1];
    let piece = lastMove.action.piece;
    let from = lastMove.action.moveFrom;
    let to = lastMove.action.moveTo;

    const y0 = getCoordinats(from)[1];
    const y1 = getCoordinats(to)[1];
    const dy = y1 - y0; 

    const pawnIndex = getIndex(pawnPos);

    if(getType(piece) === TYPES.PAWN && Math.abs(dy) === 2 && to === pawnIndex)
        return true;
    else
        return false;
}

function enemyPawnRight(enemyColor, moveFrom, board){
    let [x, y] = moveFrom;
    let squareRightCoord = x < 7 ? [x+1, y] : null;
    if(squareRightCoord !== null){
        let squareRight = board[getIndex(squareRightCoord)]
        if(squareRight !== TYPES.EMPTY && enemyColor === getColor(squareRight) && TYPES.PAWN === getType(squareRight)){
            return true;
        }
    }
    return false;
}

function movingForward(color, dy){
    return color === COLORS.WHITE ? dy > 0 : dy < 0; 
}

/*function getPosition(boardIndex){
    let Column = boardIndex % 8;
    let Row = Math.floor(boardIndex / 8);
    return [Column, Row]
}*/

function hasBlockingPiece(moveFrom, moveTo, board){
   const [fromX, fromY] = moveFrom;
   const [toX, toY] = moveTo;

  let x0 = fromX;
  let y0 = fromY;
  if(x0 !== toX)
    x0 = (toX - x0) > 0 ? x0 + 1 : x0 - 1;
  if(y0 !== toY)
    y0 = (toY - y0) > 0 ? y0 + 1 : y0 - 1;
  
  if(x0 === toX && y0 === toY){
        return false;
  }
  else if(board[getIndex([x0, y0])] !== TYPES.EMPTY){
        return true;
  }
  else{
    return hasBlockingPiece([x0, y0], [toX, toY], board);
  }  

    //Hämta alla arrayindex mellan moveFrom och moveTo

}

export function makeMove(pieceType, color, moveFrom, moveTo, board, moveCallbacks){
    if(pieceType === TYPES.PAWN && moveEnPassant(moveFrom, moveTo, board)){
        const emptySquare = color === COLORS.WHITE ? [moveTo[0], moveTo[1]-1] : [moveTo[0], moveTo[1]+1]
        moveCallbacks.enPassant(pieceType, color, moveFrom, moveTo, emptySquare);
    }
    else if(movePromotion(pieceType, moveTo[1])){
        moveCallbacks.promotion(TYPES.QUEEN, color, moveFrom, moveTo);
    }
    else if((pieceType === TYPES.KING || pieceType === TYPES.Rook) && isCastling(pieceType, color, moveFrom, moveTo, board)){
        let kingToPos;
        let rookToPos;
        let kingFromPos;
        let rookFromPos;
        
        if(pieceType === TYPES.KING){
            kingToPos = moveTo[0] - moveFrom[0] > 0 ? [moveTo[0]-1, moveTo[1]] : [moveTo[0]+1, moveTo[1]]
            rookToPos = moveTo[0] - moveFrom[0] > 0 ? [moveTo[0]-2, moveTo[1]] : [moveTo[0]+2, moveTo[1]]
            kingFromPos = moveFrom;
            rookFromPos = moveTo;
        }
        else{
            kingToPos = moveTo[0] - moveFrom[0] > 0 ? [moveFrom[0]-1, moveFrom[1]] : [moveFrom[0]+1, moveFrom[1]]
            rookToPos = moveTo[0] - moveFrom[0] > 0 ? [moveFrom[0]-2, moveFrom[1]] : [moveFrom[0]+2, moveFrom[1]]    
            kingFromPos = moveTo;
            rookFromPos = moveFrom;    
        }
     
        moveCallbacks.castling(TYPES.KING, TYPES.ROOK, color, kingFromPos, kingToPos, rookFromPos, rookToPos);
    }
    else{
        moveCallbacks.move(pieceType, color, moveFrom, moveTo);
    }
}

function isCastling(pieceType, color, moveFrom, moveTo, board){
   const [fromX, fromY] = moveFrom;
   const [toX, toY] = moveTo;
   const dx = Math.abs(toX - fromX)
    if(pieceType === TYPES.KING && dx > 1){
        return true;
    }

    let pieceColor = getColor(board[getIndex(moveTo)]);    
    if(pieceType === TYPES.ROOK && pieceColor === color){
        return true;
    }

    return false;
}

function movePromotion(pieceType, row){
    return pieceType=== TYPES.PAWN && (row === 7 || row === 0);
}

function moveEnPassant(moveFrom, moveTo, board){
  const fromX = moveFrom[0];
  const toX = moveTo[0];
  const dx = toX - fromX;

  if(Math.abs(dx) === 1 && board[getIndex(moveTo)] === TYPES.EMPTY)
    return true;
  else
    return false;
}

//
/*  GAME LAYOUT

1 a1 b1
2 a2 b2
3
4
5
6
7
8
  a  b  c  d  e  f  g  h

vilket blir

0   0  1  2  3  4  5  6  7
1   8  9 10 11 12 13 14 15
2  16 17 18 19 20 21 22 23
3  24 25 26 27 28 29 30 31
4  32 33 34 35 36 37 38 39
5  40 41 42 43 44 45 46 47
6  48 49 50 51 52 53 54 55
7  56 57 58 59 60 61 62 63
    
    0  1  2  3  4  5  6  7

Men för att underlätta om en pjäs går utanför brädan lägger vi till lite rader.
Anledningen att det finns två rader är för att hästen kan hoppa två steg

0   1  2  3  4  5  6  7  8    9
10  11 12 13 14 15 16 17 18  19
    -----------------------
20 |21 22 21 24 25 26 27 28| 29 
30 |31 32 33 34 35 36 37 38| 39
40 |41 42 43 44 45 46 47 48| 49
50 |51 52 53 54 55 56 57 58| 59
60 |61 62 63 64 65 66 67 68| 69
70 |71 72 73 74 75 76 77 78| 79
80 |81 82 83 84 85 86 87 88| 89 
90 |91 92 93 94 95 96 97 98| 99  
   ------------------------
100 101                  108 109
110 111                      119 


*/