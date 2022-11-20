import { Pgn } from 'pgn.js';
const pgn = new Pgn(
`[Site "Toronto"]
[Date "2022.11.17"]

1 .. {comment before} e4 {comment after} e5 { comment black after } (e6 { variation comment} ) {commentt pre move} 2. {comment before 2nd} Nf3    $1      {   'Great move!'     }      Nc6 *`);

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

  const pgn4 = await Pgn.load('./pgn/error.pgn');
  console.log(pgn.pgn());
  console.log(pgn2.pgn());
  console.log(pgn3.pgn());
  console.log(pgn4.pgn());

  //const pgn5 = await Pgn.load('./pgn/polgar5334.pgn');
  //console.log(pgn5.pgn());
  