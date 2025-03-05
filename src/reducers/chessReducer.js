import {TYPES, COLORS} from '../Constants'

export default function reducer(state = {
    board: [TYPES.ROOK*COLORS.WHITE, 
                TYPES.KNIGHT*COLORS.WHITE,
                TYPES.BISHOP*COLORS.WHITE,
                TYPES.KING*COLORS.WHITE,
                TYPES.QUEEN*COLORS.WHITE,
                TYPES.BISHOP*COLORS.WHITE, 
                TYPES.KNIGHT*COLORS.WHITE, 
                TYPES.ROOK*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.PAWN*COLORS.WHITE,
                TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,
                TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,
                TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,
                TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,TYPES.EMPTY,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.PAWN*COLORS.BLACK,
                TYPES.ROOK*COLORS.BLACK, 
                TYPES.KNIGHT*COLORS.BLACK,
                TYPES.BISHOP*COLORS.BLACK,
                TYPES.KING*COLORS.BLACK,
                TYPES.QUEEN*COLORS.BLACK,
                TYPES.BISHOP*COLORS.BLACK, 
                TYPES.KNIGHT*COLORS.BLACK, 
                TYPES.ROOK*COLORS.BLACK,
              ]
}, action) {
    switch (action.type) {
        case "MOVE": {
            return {
                ...state,
                board: state.board.map((item, index) => {
                    if (index !== action.moveFrom && index !== action.moveTo) {
                        // This isn't the item we care about - keep it as-is
                        return item;
                    }
                    else if (index === action.moveTo) {
                        return action.piece;
                    }
                    else if (index === action.moveFrom) {
                        return TYPES.EMPTY;
                    }
                    else {
                        return item;
                    }
                })
            }
        }
        case "PROMOTION": {
            return {
                ...state,
                board: state.board.map((item, index) => {
                    if (index !== action.moveFrom && index !== action.moveTo) {
                        // This isn't the item we care about - keep it as-is
                        return item;
                    }
                    else if (index === action.moveTo) {
                        return action.piece;
                    }
                    else if (index === action.moveFrom) {
                        return TYPES.EMPTY;
                    }
                    else {
                        return item;
                    }
                })
            }
        }
        case "ENPASSANT":{
            return {
                ...state,
                board: state.board.map((item, index) => {
                    if (index !== action.moveFrom && index !== action.moveTo && index !== action.emptySquare) {
                        // This isn't the item we care about - keep it as-is
                        return item;
                    }
                    else if (index === action.moveTo) {
                        return action.piece;
                    }
                    else if (index === action.moveFrom) {
                        return TYPES.EMPTY;
                    }
                    else if (index === action.emptySquare) {
                        return TYPES.EMPTY;
                    }
                    else {
                        return item;
                    }
                })
            }
        }
        case "CASTLING":{
            return {
                ...state,
                board: state.board.map((item, index) => {
                    if (index !== action.moveKingFrom && index !== action.moveKingTo && index !== action.moveRookTo && index !== action.moveRookFrom) {
                        // This isn't the item we care about - keep it as-is
                        return item;
                    }
                    else if (index === action.moveKingTo) {
                        return action.king;
                    }
                    else if (index === action.moveKingFrom) {
                        return TYPES.EMPTY;
                    }
                    else if (index === action.moveRookTo) {
                        return action.rook;
                    }
                    else if (index === action.moveRookFrom) {
                        return TYPES.EMPTY;
                    }
                    else {
                        return item;
                    }
                })
            }
        }
        default:
            return state;
    }
}