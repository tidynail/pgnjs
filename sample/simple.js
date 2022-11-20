import { Pgn } from 'pgn.js';
const pgn = new Pgn(
`[Site "Toronto"]
[Date "2022.11.17"]

01 .. {comment before1} e4 {comment after1} 
 e5 { comment after2 } (e6 {variation comment} ) {comment pre3} 2. {comment before3} Nf3    $1      {   'Great move!'     }      Nc6 *`, {onGame: (game, err) => {
  if(err) {
    game.tags.push({name: 'pgn.js', value: 'parsing error encountered'});
    if(err.location) {
      console.log('found:', err.found, ' at ', err.location, ' with movetext: ', err.movetext)
    } else {
      console.log(err);
    }
  }
}});

/*
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
  */