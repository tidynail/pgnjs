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
  ply: number,
  fen: string,

  nag?: string,
  commentBefore?: string,
  commentMove?: string,
  commentAfter?: string,

  variation?: move[],
  variations?: varation[],

  next: move,
  prev: move,
}

}