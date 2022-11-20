import { Pgn } from 'pgn.js';

const pgn = new Pgn(
  `[Event "?"]
  [FEN "rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13"]
  [SetUp "1"]
  
  13...Qxe4`);

  let game = pgn.game(0);
  let mv = game.move('Rxf8');
  game.add('Nd3', mv.prev);

  let v1 = game.add('N8d7', null).line;
  let v2 = game.add('Nc6', null).line;

  game.move('Nxd7', v1);
  game.move('Qxe4', v1);

  console.log(game.pgn());
