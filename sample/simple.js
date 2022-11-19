import { Pgn, Chess } from 'pgn.js';

/*
const chess = new Chess();
const pgn = new Pgn(
`[Site "Berlin"]
[Date "1989.07.02"]
[White "Haack, Stefan"]
[Black "Maier, Karsten"]

1 .. {b} e4 {c} e5 {d} (e6 {ae}) {e} 2. {f} Nf3    $1      {   'Great move!'     }      Nc6 *`);

const pgn2 = new Pgn(
`[Event "?"]
[Site "?"]
[Date "2022.11.17"]
[Round "?"]
[White "Endgame"]
[Black "?"]
[Result "*"]
[EventDate "????.??.??"]
[FEN "8/6p1/6P1/6Q1/6p1/6k1/8/5KN1 w - - 0 1"]
[SetUp "1"]
[PlyCount "3"]

1.Ne2+ Kh3 ( 1...Kf3 2.Qf4# ) ( 1...Kh2 2.Qh5# ) 2.Qh5# *`);

const pgn3 = new Pgn(
`[Event "?"]
[Site "?"]
[Date "2022.11.17"]
[Round "?"]
[White "Endgame"]
[Black "?"]
[Result "*"]
[EventDate "????.??.??"]
[FEN "8/6p1/6P1/6Q1/6p1/6k1/8/5KN1 w - - 0 1"]
[SetUp "1"]
[PlyCount "3"]

1.Ne2+ Kh3 ( 1...Kf3 ( 1...Kh2 2.Qh5# ) 2.Qf4# ) 2.Qh5# *`);
*/

  const pgn4 = await Pgn.load('var.pgn');
  
  pgn4.games[0].moves.forEach((item,idx) => {
  //console.log(idx, item.color, item.num);
  //console.log(idx, item.comment?.pre, item.comment?.before, item.comment?.after);
  if(item.vars.length)
    console.log(idx, item.vars[0].length);
  //item.variation.forEach((move,midx)=> {
  //  console.log(idx,midx,move.san)
  //});
});