/**
 * @typedef {Object} Tag
 * @prop {string} name
 * @prop {string} valuee
 */

/**
 * @typedef {Object} Move
 * 
 * from chess.js
 * @prop {string} color 'w', 'b'
 * @prop {string} from  square
 * @prop {string} to    square
 * @prop {string} flags
 * 'n' - a non-capture
 * 'b' - a pawn push of two squares
 * 'e' - an en passant capture
 * 'c' - a standard capture
 * 'p' - a promotion
 * 'k' - kingside castling
 * 'q' - queenside castling
 * @prop {string} piece  p, b, n, r, q, k
 * @prop {string} san    SAN notation
 * @prop {string=} captured
 * @prop {string=} promotion
 * 
 * extended by pgn.js
 * @prop {number} num     move number, not ply
 * @prop {string} fen     position fen
 * @prop {string} uci     uci long algerbraic notation
 * @prop {Object=} comment
 * @prop {string=} comment.pre      comment before move number
 * @prop {string=} comment.before   comment before san
 * @prop {string=} comment.after    comment after san and nag

 * @prop {string[]} nags
 * @prop {Move[][]} vars      variations (RAV)
 * @prop {Object=} over
 * @prop {boolean=} over.mate checkmate
 * @prop {string=} over.draw  'stale', '3fold', 'fifty', 'material'

 * @prop {number} ply
 * @prop {Move[]} line    the line contaning this move
 * @prop {Move} prev      previous move
 */

/**
 * @typedef {Object} Err
 * @prop {string=} msg
 * @prop {string=} fen
 * @prop {string=} san
 * @prop {number=} num
 * @prop {string=} movetext
 * 
 * from parser
 * @prop {string=} found  unexpected token
 * @prop {Object=} location
 * @prop {Object} location.start
 * @prop {number} location.start.offset
 * @prop {number} location.start.line
 * @prop {number} location.start.column
 * @prop {number} location.end.offset
 * @prop {number} location.end.line
 * @prop {number} location.end.column
 */

/**
 * @callback OnGame
 * @param {Game} game   parsed game
 * @param {Err} error   error
 * @return {void}
 */

/**
 * @callback OnFinish
 * @return {void}
 */

/**
 * @typedef {Object} Options
 * @prop {boolean=} verbose print error message
 * @prop {OnGame} onGame    called when a game is parsed
 * @prop {OnFinish} onFinish
 */
