import {TYPES, COLORS} from '../Constants'

export default function reducer(state = {
    primeboard: []
}, action) {
    switch (action.type) {
        case "PRIMEMOVE": {
            return {
                ...state,
                primeboard: state.primeboard.map((item, index) => {
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
        case "PRIMEPROMOTION": {
            return {
                ...state,
                primeboard: state.primeboard.map((item, index) => {
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
        case "PRIMEENPASSANT":{
            return {
                ...state,
                primeboard: state.primeboard.map((item, index) => {
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
        case "PRIMECASTLING":{
            return {
                ...state,
                primeboard: state.primeboard.map((item, index) => {
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