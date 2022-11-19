declare module "pgn.js" {

export interface move {
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

  // extends
  num: number,            // move number, not ply
  fen: string,

  comment? : {
    pre?: string,         // comment before move number
    before?: string,      // comment before san
    after?: string        // comment after san and nag
  },
  nag?: string,           // $<number>

  vars?: move[][],

  ply: number,
  next: move,
  prev: move,
}

}