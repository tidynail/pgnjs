import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Sample');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

// add a move to the mainline
let mvQxe4 = game.add('Qxe4');
//  13...Qxe4

// add another to the mainline
game.add('Rxf8');
// 13...Qxe4 14.Rxf8+

// add a varation to the next to 'Qxe4'
game.add('Nd3', mvQxe4);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )

// add 2 variations for the first move
// null == the prev of Qxe4
let mvN8d7 = game.add('N8d7', null);
game.add('Nc6', null);
// 13...Qxe4
//   ( 13...N8d7 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves after 'N8d7'
game.add('Nxd7', mvN8d7);
game.add('Qxe4'); // to the previous
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7 Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add a variation to' N8d7'
game.add('Nf7', mvN8d7);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7
//     ( 14.Nf7 )
//   14...Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the last line 'Nf7'
game.add('Qd5');
game.add('Nh6');

//game.delTag('event');
//game.delTag('fen');
//game.delTag('setup');

console.log(game.pgn());
