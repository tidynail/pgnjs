import { createWriteStream } from 'node:fs';
import { Pgn } from 'pgn.js';

var writer = createWriteStream('output.pgn');

let ngames = 0;
Pgn.load('./pgn/big.pgn', {onGame: (game) => {
  writer.write(game.pgn() + '\n');
  ngames++;
  console.error(`${ngames} parsed`);
}});
