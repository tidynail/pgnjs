import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Sample');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

// add a move to the mainline
game.move('Qxe4');
//  13...Qxe4

// add another to the mainline
let mv = game.move('Rxf8');
// 13...Qxe4 14.Rxf8+

// add a varation to the next to mv.prev == 'Qxe4'
game.var('Nd3', mv.prev);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )

// add 2 variations for the first move 13...Qxe4
// the prev of the first move == null
let vm = game.var('N8d7', null);
game.var('Nc6', null);
// 13...Qxe4
//   ( 13...N8d7 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the saved 'N8d7' line
mv = game.move('Nxd7', vm.line);
game.move('Qxe4', vm.line);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7 Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add another variation line to the variation 'Nxd7' line above
vm = game.var('Nf7', mv.prev);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7
//     ( 14.Nf7 )
//   14...Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the last variation line 'Nf7'
game.move('Qd5', vm.line);
game.move('Nh6', vm.line);

//game.delTag('event');
//game.delTag('fen');
//game.delTag('setup');

console.log(game.pgn());
