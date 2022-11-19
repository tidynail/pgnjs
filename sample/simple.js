import { Pgn, Chess } from 'pgn.js';

const chess = new Chess();
const pgn = new Pgn(`[Site "Berlin"]
[Date "1989.07.02"]
[White "Haack, Stefan"]
[Black "Maier, Karsten"]

1 .. {b} e4 {c} e5 {d} (e6 {ae}) {e} 2. {f} Nf3    $1      {   'Great move!'     }      Nc6 *`);

pgn.games[0].moves.forEach((item,idx) => {
  console.log(idx, item.color, item.num);
  console.log(idx, item.comment?.pre, item.comment?.before, item.comment?.after);
  //if(item.variations.length)
  //  console.log(idx, item.variations[0]);
  //item.variation.forEach((move,midx)=> {
  //  console.log(idx,midx,move.san)
  //});
});