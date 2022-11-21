# pgn.js

Chess PGN, [Portable Game Notation](http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm), Javascript Library

# Why Another?

1. Multiple Games Parsing and Generation
2. Commments and Variations Handling
3. Sync for CLI use, Async for large file handling with callbacks
4. Single dependency [chess.js](https://www.npmjs.com/package/chess.js), Exported as well

# Simple Parsing

```js
import { Pgn } from 'pgn.js';
const pgn = new Pgn(
`[Event "Sample"]
[Site "Toronto"]
[Date "2022.11.17"]
{This is a sample game for Png.js}
1.d4 (1.e4 c5 (1...e5 Bc4) (1...e6)) d5 {move comment} 
2.c4 (2.Nf3 {variation move comment} Nf6) 
(2. {comment before a move} Bf4) 2...c6 Nf3`);

console.log(pgn.pgn());
```
### Output

```
[Event "Sample"]
[Site "Toronto"]
[Date "2022.11.17"]

{ This is a sample game for Png.js } 1.d4
  ( 1.e4 c5
    ( 1...e5 2.Bc4 )
    ( 1...e6 )
  )
1...d5 { move comment } 2.c4
  ( 2.Nf3 { variation move comment } 2...Nf6 )
  ( 2. { comment before a move } Bf4 )
2...c6 3.Nf3 *
```

# Composing a Game

```js
import { Pgn } from 'pgn.js';

const pgn = new Pgn();

let game = pgn.newgame();
game.setTag('Event', 'Sample');
game.setFen('rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13');

// add a move to the mainline
game.move('Qxe4');
//  13...Qxe4

// add another to the mainline
let mv = game.move('Rxf8');
// 13...Qxe4 14.Rxf8+

// add a varation to the next to mv.prev == 'Qxe4'
game.var('Nd3', mv.prev);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )

// add 2 variations for the first move 13...Qxe4
// the prev of the first move == null
let vm = game.var('N8d7', null);
game.var('Nc6', null);
// 13...Qxe4
//   ( 13...N8d7 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the saved 'N8d7' line
mv = game.move('Nxd7', vm.line);
game.move('Qxe4', vm.line);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7 Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add another variation line to the variation 'Nxd7' line above
vm = game.var('Nf7', mv.prev);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7
//     ( 14.Nf7 )
//   14...Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the last variation line 'Nf7'
game.move('Qd5', vm.line);
game.move('Nh6', vm.line);

console.log(game.pgn());
```

### Output

```
[Event "Sample"]
[FEN "rn3rk1/ppp1b1pp/1n2p3/4N2Q/3qNR2/8/PPP3PP/R1B4K b - - 0 13"]
[SetUp "1"]

13...Qxe4
  ( 13...N8d7 14.Nxd7
    ( 14.Nf7 Qd5 15.Nh6+ )
  14...Qxe4 )
  ( 13...Nc6 )
14.Rxf8+
  ( 14.Nd3 )
```

# Add Moves

* move(san: string, line?: Move[]): Move | null

```js
// add a move to the end of the mainline
game.move('Qxe4');

// add a move to the end of the vm.line variation
game.move('Nxd7', vm.line);
```

# Variations

1. var(san: string, prev?: Move): Move | null
2. main(san: string, prev?: Move): Move | null
3. next(san: string, prev?: Move): Move | null
4. replace(san: string, prev?: Move): Move | null

### Precondition
```js
game.move('Qxe4');
let mv = game.move('Rxf8');
// 13...Qxe4 14.Rxf8+
// mv == 'Rxf8', mv.prev == 'Qxe4'
```
## var, as the last variation

add the move as the last variation

```js
game.var('Nd3', mv.prev);
game.var('Bd2', mv.prev);
game.var('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )
//   ( 14.Bd2 )
//   ( 14.Be3 )
```

## next, as the next variation

add the move as the very next variation

```js
game.next('Nd3', mv.prev);
game.next('Bd2', mv.prev);
game.next('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Rxf8+
//   ( 14.Be3 )
//   ( 14.Bd2 )
//   ( 14.Nd3 )
```

## main, as the mainline

make others as variations

```js
game.main('Nd3', mv.prev);
game.main('Bd2', mv.prev);
game.main('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )
```

## replace, no variation

overwite old move, no variation

```js
game.replace('Nd3', mv.prev);
game.replace('Bd2', mv.prev);
game.replace('Be3', mv.prev);
console.log(pgn.pgn());
// 13...Qxe4 14.Be3
```

# Async, big file handling

Without loading the whole file, parsing games as reading the input file.

```js
async Pgn.load(path: string, opts: Option): Pgn;
  // stdin if path == ''

opts.onGame: (game: Game, error: Error) => void
opts.onFinish: () => void
```

## Example

In this example, we write a parsed game to the output file as soon as it's parsed.

```js
import { createWriteStream } from 'node:fs';
import { Pgn } from 'pgn.js';

var writer = createWriteStream('output.pgn');

let ngames = 0;
Pgn.load('./pgn/big.pgn', {onGame: (game) => {
  ngames++;

  writer.write(game.pgn() + '\n');
  console.log(`${ngames} parsed`);
}});

```

# Error Handling

## Type

```ts
export interface Error {
  msg?: string,
  fen?: string,
  san?: string,
  num?: number,
  movetext?: string,

  // from parser
  found?: string,   // unexpected token
  location: {
    start: { offset: number, line: number, column: number},
    end: { offset: number, line: number, column: number}
  }    
};
```

## Example

```js
import { createWriteStream } from 'node:fs';
import { Pgn } from 'pgn.js';

var writer = createWriteStream('output.pgn');

let ngames = 0;
Pgn.load('./pgn/big2.pgn', {onGame: (game, err) => {
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
```

# Types

## Options

```ts
export interface Options {
  verbose: boolean, // print error message
  onGame: (game: Game, error: Error): void,
  onFinish: (): void,
};
```

## Move

```ts
export interface Move {
  // from chess.js
  color: string, /* 'w', 'b' */
  from: string,
  to: string,
  flags: string,
    /*
    'n' - a non-capture
    'b' - a pawn push of two squares
    'e' - an en passant capture
    'c' - a standard capture
    'p' - a promotion
    'k' - kingside castling
    'q' - queenside castling
    */
  piece: string, /* p, b, n, r, q, k */
  san: string,
  captured?: string,
  promotion?: string,

  // extends by pgn.js
  num: number,            // move number, not ply
  fen: string,
  uci: string,            // uci long algebraic notation

  comment?: {
    pre?: string,         // comment before move number
    before?: string,      // comment before san
    after?: string        // comment after san and nag
  },
  nag?: string,           // $<number>

  vars?: Move[][],

  // status
  over?: {
    mate?: boolean,       // checkmate
    draw?: string,        // stale, 3fold, fifty, material
  },
  check?: boolean,        // check by this move

  ply: number,
  line: Move[],         // array containing this move
  prev: Move,           // previous move
};
```

## Tag

```ts
export interface Tag {
  name: string,
  value: string,
};
```

## Pgn

### Data
```js
pgn.games = Game[];
```

### Functions

```js
Pgn(pgn: string, opts: Options);

pgn.count() : Number  // # of games
pgn.game(idx: Number): Game // access a game

static async Pgn.load(path: string, opts: Options): Pgn 
  // load from file, stdin if path == ''
```

## Game

### Data

```js
game.tags = Tag[];
game.moves = Move[];
```

### Functions

```js
game.setupFen(): string | undefined                 // setup fen string or undefined if none
game.setFen(fen: string);                           // set setup fen string
game.setTag(name: string, value: string);           // set a tag
game.delTag(name);                                  // delete a tag

game.move(san: string, line?: Move[]): Move | null  // append a move to the line
game.var(san: string, prev?: Move): Move | null     // add a last variation move
game.main(san: string, prev?: Move): Move | null    // add a mainline move
game.next(san: string, prev?: Move): Move | null    // add a next variation move
game.replace(san: string, prev?: Move): Move | null // replace a move
```