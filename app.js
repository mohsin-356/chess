// const socket = require('socket.io');
// const http = require('http');
// const {Chess} = require('chess.js');
// const path = require('path');

// // Set up the express-server
// const express = require('express');
// const app = express();
// app.set('view engine', 'ejs');//set the view engine to ejs
// //set up the socket.io server
// const server = http.createServer(app);
// const io = socket(server);
// //set the path for static files like: css, js, images
// app.use(express.static(path.join(__dirname,'/public')));

// let chess = new Chess();
// let players = {};
// let currentPlayer = 'w';
// app.get('/', (req, res) => {
//     res.render('index');
// });

// io.on('connection', (uniquesocket) => {
//     console.log('New client connected');
//     if(!players.white)
//     {
//         players.white=uniquesocket.id;
//         uniquesocket.emit('playerRole','w');
//     }
//     else if(!players.black)
//     {
//         players.black=uniquesocket.id;
//         uniquesocket.emit('playerRole','b');
//     }
//     else
//     {
//         uniquesocket.emit('spectatorRole');
//     }

//     uniquesocket.on('disconnect',()=>{
//         if(uniquesocket.id===players.white)
//         {
//             delete players.white;
//         }
//         else if(uniquesocket.id===players.black)
//         {
//             delete players.black;
//         }
//     });
//     uniquesocket.on('move', (move) => {
//         try {
//             console.log("Received move:", move);
    
//             // Ensure the correct player is making the move
//             if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
//             if (chess.turn() === "b" && uniquesocket.id !== players.black) return;
    
//             const result = chess.move(move);
    
//             if (result) {
//                 currentPlayer = chess.turn();
//                 io.emit('move', move);  // Broadcast move to all players
//                 io.emit('boardState', chess.fen());  // Update board state for all players
//             } else {
//                 console.log('Invalid move:', move);
//                 uniquesocket.emit('invalidMove', move);   
//             }
//         } catch (error) {
//             console.log('Error:', error);
//             uniquesocket.emit('invalidMove', move); 
//         }
//     });
    
//     // uniquesocket.on('move',(move)=>{
//     //   try 
//     //   {
//     //     if(chess.turn()==="w" && uniquesocket.id!==players.white)return;
//     //     if(chess.turn()==="b" && uniquesocket.id!==players.black)return;
//     //     const result = chess.move(move);
//     //     if (result)
//     //     {
//     //         currentPlayer=chess.turn();
//     //         io.emit('move',move);
//     //         io.emit('boardState',chess.fen());
//     //     }
//     //     else
//     //     {
//     //         console.log('Invalid move:',move);
//     //         uniquesocket.emit('invalidMove',move);   
//     //     }
//     //   } 
//     //   catch (error)
//     //   {
//     //         console.log('Error:',error);
//     //         uniquesocket.emit('invalidMove',move); 
//     //   }
//     // });
// });
// server.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });




const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

// Set up Express server
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, '/public')));

let chess = new Chess();
let players = {};
let currentPlayer = 'w'; // White starts

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (uniquesocket) => {
    console.log('New client connected:', uniquesocket.id);

    // Assign player roles
    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit('playerRole', 'w');
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit('playerRole', 'b');
    } else {
        uniquesocket.emit('spectatorRole');
    }

    // Send initial board state to new player
    uniquesocket.emit('boardState', chess.fen());

    uniquesocket.on('disconnect', () => {
        if (uniquesocket.id === players.white) {
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    uniquesocket.on('move', (move) => {
        try {
            console.log("Received move:", move);

            // Ensure correct player makes the move
            if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

            const result = chess.move(move);

            if (result) {
                currentPlayer = chess.turn();
                io.emit('move', move);
                io.emit('boardState', chess.fen());
            } else {
                console.log('Invalid move:', move);
                uniquesocket.emit('invalidMove', move);
            }
        } catch (error) {
            console.log('Error:', error);
            uniquesocket.emit('invalidMove', move);
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
