import { Pgn } from 'pgn.js';

const pgn = new Pgn(
  `[Event "?"]
  [FEN "rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13"]
  [SetUp "1"]
  
  13...Qxe4`);

  let game = pgn.game(0);
  let mv = game.move('Rxf8');
  game.var('Nd3', mv.prev);

  let vm = game.var('N8d7', null);
  game.var('Nc6', null);

  mv = game.move('Nxd7', vm.line);
  game.move('Qxe4', vm.line);
  vm = game.var('Nf7', mv.prev);
  game.move('Qd5', vm.line);
  game.move('Nh6', vm.line);

  console.log(game.pgn());
