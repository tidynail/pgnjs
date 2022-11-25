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
{This is a sample game for Pgn.js}
1.d4 (1.e4 c5 (1...e5 Bc4) (1...e6)) d5 {move comment}
2.c4! +- (2.Nf3 {variation move comment} Nf6)
(2. {comment before a move} Bf4) 2...c6 Nf3`);

console.log(pgn.pgn());
```
### Output

```
[Event "Sample"]
[Site "Toronto"]
[Date "2022.11.17"]

{ This is a sample game for Pgn.js }
1.d4
  ( 1.e4 c5
    ( 1...e5 2.Bc4 )
    ( 1...e6 )
  )
1...d5 { move comment } 2.c4! +-
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

// add a move
let mvQxe4 = game.add('Qxe4');
//  13...Qxe4

// add a move next to the previous one
game.add('Rxf8');
// 13...Qxe4 14.Rxf8+

// add a varation to the next to 'Qxe4'
game.add('Nd3', mvQxe4);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )

// add 2 variations at the beginning
// null == the begin of the game
let mvN8d7 = game.add('N8d7', null);
game.add('Nc6', null);
// 13...Qxe4
//   ( 13...N8d7 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves next to 'N8d7'
game.add('Nxd7', mvN8d7);
game.add('Qxe4'); // undefined == next to the previous
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7 Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add a variation next to' N8d7'
game.add('Nf7', mvN8d7);
// 13...Qxe4
//   ( 13...N8d7 14.Nxd7
//     ( 14.Nf7 )
//   14...Qxe4 )
//   ( 13...Nc6 )
// 14.Rxf8+
//   ( 14.Nd3 )

// add moves to the previous
game.add('Qd5');
game.add('Nh6');

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
*
```

# Add a Move

```js
Game.add(san: string, prev?: Move | null, varmode?: VAR): Move | null;
  // prev
  // if 'undefined', next to the previously added move
  // if 'null', as the first move
  // otherwise, next to 'prev' move
  //
  // varmode
  // if 'undefined' or 'null', Game.var, default==VAR.last
  // VAR.last, as the last variation
  // VAR.next, as the next variation
  // VAR.main, as the main line
  // VAR.replace, delete existing, no variation
```

## Examples

```js
// add a move
let mvQxe4 = game.add('Qxe4');
  // 13...Qxe4

// add a move next to the previous move 'Qxe4'
game.add('Rxf8');
  // 13...Qxe4 14.Rxf8+
```
### game.var == VAR.last by default
```js
game.add('Nd3', mvQxe4);
game.add('Bd2', mvQxe4);
game.add('Be3', mvQxe4);
// 13...Qxe4 14.Rxf8+
//   ( 14.Nd3 )
//   ( 14.Bd2 )
//   ( 14.Be3 )
```

### VAR.next, as the next variation

```js
game.add('Nd3', mvQxe4, VAR.next);
game.add('Bd2', mvQxe4, VAR.next);
game.add('Be3', mvQxe4, VAR.next);
// 13...Qxe4 14.Rxf8+
//   ( 14.Be3 )
//   ( 14.Bd2 )
//   ( 14.Nd3 )
```

## VAR.main, as the mainline

```js
game.add('Nd3', mvQxe4, VAR.main);
game.add('Bd2', mvQxe4, VAR.main);
game.add('Be3', mvQxe4, VAR.main);
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )
```

## VAR.replace, no variation

```js
game.add('Nd3', mvQxe4, VAR.replace);
game.add('Bd2', mvQxe4, VAR.replace);
game.add('Be3', mvQxe4, VAR.replace);
// 13...Qxe4 14.Be3
```

## change default var mode

```js
game.var = VAR.main;
game.add('Nd3', mvQxe4);
game.add('Bd2', mvQxe4);
game.add('Be3', mvQxe4);
// 13...Qxe4 14.Be3
//   ( 14.Bd2 )
//   ( 14.Nd3 )
//   ( 14.Rxf8+ )
```

# Async, big file handling

Without loading the whole file, parsing games as reading the input file.

```js
async Pgn.load(path: string, opts?: Option): Pgn;
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
type Err = {
    msg?: string | undefined;
    fen?: string | undefined;
    san?: string | undefined;
    num?: number | undefined;
    movetext?: string | undefined;
    /**
     * unexpected token
     */
    found?: string | undefined;
    location?: any | undefined;
    start: {
        offset: number;
        line: number;
        column: number;
    };
    end: {
        offset: number;
        line: number;
        column: number;
    };
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
type OnGame = (game: Game, error: Err) => void;
type OnFinish = () => void;
type Options = {
    /**
     * print error message
     */
    verbose?: boolean | undefined;
    /**
     * called when a game is parsed
     */
    onGame: OnGame;
    onFinish: OnFinish;
};
```

## Move

```ts
type Move = {
    /**
     * 'w', 'b'
     */
    color: string;
    /**
     * square
     */
    from: string;
    /**
     * square
     */
    to: string;
    /**
     * 'n' - a non-capture
     * 'b' - a pawn push of two squares
     * 'e' - an en passant capture
     * 'c' - a standard capture
     * 'p' - a promotion
     * 'k' - kingside castling
     * 'q' - queenside castling
     */
    flags: string;
    /**
     * p, b, n, r, q, k
     */
    piece: string;
    /**
     * SAN notation
     */
    san: string;
    captured?: string | undefined;
    /**
     * extended by pgn.js
     */
    promotion?: string | undefined;
    /**
     * move number, not ply
     */
    num: number;
    /**
     * position fen
     */
    fen: string;
    /**
     * uci long algerbraic notation
     */
    uci: string;
    comment: {
        pre?: string | undefined;
        before?: string | undefined;
        after?: string | undefined;
    };
    nags: string[];
    /**
     * variations (RAV)
     */
    vars: Move[][];
    over: {
        mate?: boolean | undefined;
        draw?: string | undefined;
    };
    ply: number;
    /**
     * the line contaning this move
     */
    line: Move[];
    /**
     * previous move
     */
    prev: Move;
};
```

## Tag

```ts
type Tag = {
    name: string;
    valuee: string;
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

pgn.count() : Number          // # of games
pgn.game(idx: Number): Game   // access a game
pgn.newgame(): Game           // create a new game
pgn.pgn(): void;              // pgn string

static async Pgn.load(path: string, opts: Options): Pgn 
  // load from file, stdin if path == ''
```

## Game

### Data

```js
game.tags: Tag[];
game.moves: Move[];
game.gtm : string;      // game termintion mark
```

### Functions

```ts
game.setupFen(): string | undefined             // setup fen string or undefined if none
game.setFen(fen: string): void;                 // set setup fen string (and SetUp)
game.delFen(): void;                            // delete setup fen string (and SetUp)
game.setTag(name: string, value: string): void; // set a tag
game.delTag(_name: any): void;                  // delete a tag

game.add(san: string, prev?: Move | undefined, varmode?: {
            replace: string;
            main: string;
            next: string;
            last: string;
        } | undefined): Move;

game.pgn(): void;                               // pgn string
```