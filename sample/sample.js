import { Pgn } from 'pgn.js';
const pgn = new Pgn(
`[Event "Sample"]
[Site "Toronto"]
[Date "2022.11.17"]
{This is a sample game for Png.js}
1.d4 (1.e4 c5 (1...e5 Bc4) (1...e6)) d5 {move comment}
2.c4! +- (2.Nf3 {variation move comment} Nf6)
(2. {comment before a move} Bf4) 2...c6 Nf3`);

console.log(pgn.pgn());