import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Sample');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

// add a move
game.add('Qxe4').nags = ['!'];
//  13...Qxe4

// add a move next to the previous one
game.add('Rxf8').nags = ['?', '+-'];;
// 13...Qxe4 14.Rxf8+

console.log(game.pgn());