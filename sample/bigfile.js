import { createWriteStream } from 'node:fs';
import { Pgn } from 'pgn.js';

var writer = createWriteStream('output.pgn');

let ngames = 0;
Pgn.load('./pgn/big.pgn', {onGame: (game, err) => {
  ngames++;

  if(err) {
    game.tags.push({name: 'pgn.js', value: 'parsing error encountered'});
    if(err.location) {
      console.log('found:', err.found, ' at ', err.location, ' with movetext: ', err.movetext);
    } else {
      console.log(err);
    }
  }
  writer.write(game.pgn() + '\n');
  console.log(`${ngames} parsed ${err?'- error!':''}`);
}});
