// const socket = io();
// const chess=new Chess();
// const boardElement = document.querySelector('.chessboard');

// // Initialize the chessboard
// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard=()=>{
//     const board=chess.board();
//     boardElement.innerHTML='';
//     board.forEach((row, rowIndex) => {
//         row.forEach((square,squareIndex)=>{

//            const squareElement=document.createElement('div');
//            squareElement.classList.add('square',(rowIndex+squareIndex)%2===0?'light':'dark');

//             squareElement.dataset.row=rowIndex;
//             squareElement.dataset.col=squareIndex;

//             if(square)
//             {
//                 const pieceElement=document.createElement('div');
//                 pieceElement.classList.add('piece',square.color==='w' ? 'white':'black');
//                 pieceElement.innerHTML=getPieceUnicode(square);
//                 pieceElement.draggable=playerRole===square.color;
//                 pieceElement.addEventListener('dragstart',(e)=>
//                 {
//                     if (pieceElement.draggable)
//                     {
//                         draggedPiece=pieceElement;
//                         sourceSquare={row:rowIndex,col:squareIndex};
//                         e.dataTransfer.setData('text/plain', '');
//                     }
//                 });
//                 pieceElement.addEventListener('dragend',(e)=>
//                 {
//                     draggedPiece=null;
//                     sourceSquare=null;
//                 });
//                 squareElement.appendChild(pieceElement);
//             }
//             squareElement.addEventListener('dragover',(e)=>
//             {
//                 e.preventDefault();
//             });
//             squareElement.addEventListener('drop',(e)=>
//             {
//                 if(draggedPiece)
//                 {
//                     const targetSource={

//                         row:parseInt(squareElement.dataset.row),
//                         col:parseInt(squareElement.dataset.col)

//                     };
//                     handleMove(sourceSquare,targetSource);
//                 }
//             });
//             boardElement.appendChild(squareElement);
//         });
//     });
//     if (playerRole==='b')
//     {
//         boardElement.classList.add('flipped');
//     }
//     else
//     {
//         boardElement.classList.remove('flipped');
//     }
// };

// const handleMove=(source,target)=>{
//     if (!source || !target) {
//         console.error("Invalid move source/target:", source, target);
//         return;
//     }
//     const move={
//         from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
//         to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
//         promotion: 'q'
//     };

//     socket.emit('move',move);

// };
// // Function to get pieceUnicode
// const getPieceUnicode=(piece)=>{
//     const unicodePieces = {
//         p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔",
//         P: "♟", R: "♜", N: "♞", B: "♝", Q: "♛", K: "♚"
//     };
//     return unicodePieces[piece.type] || "";
// }
// socket.on('playerRole',function(role){
//     playerRole=role;
//     renderBoard();
// });
// socket.on('spectatorRole',function(){
//     playerRole=null;
//     renderBoard();
// });
// socket.on('boardState', function(fen) {
//     console.log("Updating board state with FEN:", fen);
//     chess.load(fen);
//     renderBoard();
// });

// socket.on('move',function(move){

//     console.log("Received move from server:", move);

//     const result=chess.move(move);

//     if (!result) 
//     {
//         console.error("Invalid move received:", move);
//         return;
//     }

//     renderBoard();
// });
// renderBoard();
const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = '';

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square', (rowIndex + squareIndex) % 2 === 0 ? 'light' : 'dark');
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', square.color === 'w' ? 'white' : 'black');
                pieceElement.innerHTML = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener('dragstart', (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData('text/plain', '');
                    }
                });

                pieceElement.addEventListener('dragend', () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener('dragover', (e) => e.preventDefault());
            squareElement.addEventListener('drop', (e) => {
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSource);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === 'b') {
        boardElement.classList.add('flipped');
    } else {
        boardElement.classList.remove('flipped');
    }
};

const handleMove = (source, target) => {
    if (!source || !target) {
        console.error("Invalid move source/target:", source, target);
        return;
    }

    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    // Check if it's this player's turn before sending move
    if (chess.turn() !== playerRole) {
        console.error("Not your turn!");
        return;
    }

    socket.emit('move', move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔",
        P: "♟", R: "♜", N: "♞", B: "♝", Q: "♛", K: "♚"
    };
    return unicodePieces[piece.type] || "";
};

socket.on('playerRole', function (role) {
    playerRole = role;
    console.log("Assigned role:", role);
    renderBoard();
});

socket.on('spectatorRole', function () {
    playerRole = null;
    renderBoard();
});

socket.on('boardState', function (fen) {
    console.log("Updating board state with FEN:", fen);
    chess.load(fen);
    renderBoard();
});

socket.on('move', function (move) {
    console.log("Received move from server:", move);

    const result = chess.move(move);
    if (!result) {
        console.error("Invalid move received:", move);
        return;
    }

    renderBoard();
});

renderBoard();
