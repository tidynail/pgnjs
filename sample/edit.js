import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Sample');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

// add a move
let mvQxe4 = game.add('Qxe4');
//  13...Qxe4

// add a move next to the previous one
game.add('Rxf8');
// 13...Qxe4 14.Rxf8+

// add a varation to the next to 'Qxe4'
game.add('Nd3', mvQxe4);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )

// add 2 variations at the beginning
// null == the begin of the game
let mvN8d7 = game.add('N8d7', null);
game.add('Nc6', null);
// 13...Qxe4
//   ( 13...N8d7 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves next to 'N8d7'
game.add('Nxd7', mvN8d7);
game.add('Qxe4'); // undefined == next to the previous
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7 Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add a variation next to' N8d7'
game.add('Nf7', mvN8d7);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7
//     ( 14.Nf7 )
//   14...Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the previous
game.add('Qd5');
game.add('Nh6');

//game.delTag('event');
//game.delTag('fen');
//game.delTag('setup');

console.log(game.pgn());
