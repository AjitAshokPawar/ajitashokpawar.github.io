export const TYPES = {
  EMPTY: 0,
  PAWN: 5,
  KNIGHT: 7,
  BISHOP: 11,
  ROOK: 13,
  QUEEN: 17,
  KING: 19
};

export const COLORS = {
  WHITE: 2,
  BLACK: 3,
  NOCOLOR: -1
};

export const PLAYERCOLOR = COLORS.BLACK;

export const STRINGTYPES = {
  PAWN: "PAWN",
  KNIGHT: "KNIGHT",
  BISHOP: "BISHOP",
  ROOK: "ROOK",
  QUEEN: "QUEEN",
  KING: "KING",
  PIECE: "PIECE"
};

export function combineTypeColor(piece, color){
    return (piece * color);
}

export function getColor(piece){
    if(piece === TYPES.EMPTY || piece === undefined){
        return COLORS.EMPTY;
    }
    return piece % COLORS.WHITE === 0 ? COLORS.WHITE : COLORS.BLACK;
}

export function getType(piece){
    if(piece === undefined){
        return TYPES.EMPTY;
    }
    return piece % COLORS.WHITE === 0 ? piece/COLORS.WHITE : piece/COLORS.BLACK;
}

export function getCurrentHistoryAsArray(node, histories = []){
    if(node === undefined || node === null){
        return histories;
    }
    //The most recent moves are always the right most nodes in the tree, which is the last child
    let nextNode = node.children[node.children.length-1];
    if(isRoot(node)){   //Don't see the point of showing the inital state in the history
        return getCurrentHistoryAsArray(nextNode, histories);
    }
    else{
        histories.push({action: node.action, branch: node.branch, depth: node.depth})
        return getCurrentHistoryAsArray(nextNode, histories);
    }
}

function isRoot(node){
    return node.action.type === "@@redux-branchable/INIT";
}


export function getIndex(coord){
    const [x, y] = coord;
    return x + y*8; 
}

export function getOpposingColor(color){
    return color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
}

export function getCoordinats(index){
    const row = Math.floor(index/8)
    const col = index % 8;
  return [col, row];
}

/*  GAME LAYOUT
RANKS
1 a1 b1
2 a2 b2
3
4
5
6
7
8
  a  b  c  d  e  f  g  h FILES

vilket blir

1  0  1  2  3  4  5  6  7
2  8  9 10 11 12 13 14 15
3 16 17 18 19 20 21 22 23
4 24 25 26 27 28 29 30 31
5 32 33 34 35 36 37 38 39 
6 40 41 42 43 44 45 46 47
7 48 49 50 51 52 53 54 55
8 56 57 58 59 60 61 62 63
  a  b  c  d  e  f  g  h  

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