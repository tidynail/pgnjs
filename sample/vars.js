import { Game, VAR } from 'pgn.js';

let game = new Game();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

let mvQxe4 = game.add('Qxe4');
game.add('Rxf8');

// default
game.add('Nd3', mvQxe4);
game.add('Bd2', mvQxe4);
game.add('Be3', mvQxe4);
console.log('default', game.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )
//   ( 14.Bd2 )
//   ( 14.Be3 )

game = new Game();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

mvQxe4 = game.add('Qxe4');
game.add('Rxf8');

// VAR.next
game.add('Nd3', mvQxe4, VAR.next);
game.add('Bd2', mvQxe4, VAR.next);
game.add('Be3', mvQxe4, VAR.next);
console.log('next', game.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Be3 )
//   ( 14.Bd2 )
//   ( 14.Nd3 )

game = new Game();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

mvQxe4 = game.add('Qxe4');
game.add('Rxf8');

// VAR.main
game.add('Nd3', mvQxe4, VAR.main);
game.add('Bd2', mvQxe4, VAR.main);
game.add('Be3', mvQxe4, VAR.main);
console.log('main', game.pgn());
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )

game = new Game();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

mvQxe4 = game.add('Qxe4');
game.add('Rxf8');

// VAR.replace
game.add('Nd3', mvQxe4, VAR.replace);
game.add('Bd2', mvQxe4, VAR.replace);
game.add('Be3', mvQxe4, VAR.replace);
console.log('replace', game.pgn());
// 13...Qxe4 14.Be3

game = new Game();
game.setTag('Event', 'Samaple');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

mvQxe4 = game.add('Qxe4');
game.add('Rxf8');

// default change
game.var = VAR.main;
game.add('Nd3', mvQxe4);
game.add('Bd2', mvQxe4);
game.add('Be3', mvQxe4);
console.log('.var=main', game.pgn());
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )
