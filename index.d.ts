declare module "pgn.js" {

export type Games = Game[];

export interface Tag {
  name: string,
  value: string,
};

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

export interface Options {
  verbose: boolean, // print error message
  onGame: (game: Game, error: Error) => void,
  onFinish: () => void,
};

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

} // declare module

