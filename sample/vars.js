import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

game.move('Qxe4');
let mv = game.move('Rxf8');
// 13...Qxe4 14.Rxf8+
// mv == 'Rxf8', mv.prev == 'Qxe4'

game.var('Nd3', mv.prev);
game.var('Bd2', mv.prev);
game.var('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )
//   ( 14.Bd2 )
//   ( 14.Be3 )

game.next('Nd3', mv.prev);
game.next('Bd2', mv.prev);
game.next('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Be3 )
//   ( 14.Bd2 )
//   ( 14.Nd3 )
  
game.main('Nd3', mv.prev);
game.main('Bd2', mv.prev);
game.main('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )

game.replace('Nd3', mv.prev);
game.replace('Bd2', mv.prev);
game.replace('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Be3