import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

import { parse } from './pgnparser.js';
import { Chess } from 'chess.js';

export class Pgn {
  /**
   * @param {string} path
   * @param {Options} opts
   * @return {Pgn} pgn
   */
  static async load(path, opts = {}) {
    let pgn = new Pgn('', opts);
    pgn.games = await pgn._from_file(path, options);
    return pgn;
  }

  /**
   * @param {string} pgn
   * @param {Options} opts
   */
  constructor(pgn = '', opts = {}) {
    this.games = this._from_pgn(pgn, opts);
  }

  _from_pgn(pgn = '', opts = {}) {
    const sloppy = !!opts.sloppy;
    const lines = pgn.split('\n');

    let ctx = {
      games: [],  // parsed games
      game: { tags: [], moves: []},  // current game
      in_movetext: false, // line parsing status whether 'in movetext'
      movetext: '', // current collecting movetext
    };

    for(const line of lines) {      
      this._handle_line(ctx, line + '\n', sloppy);
    }

    return ctx.games;
  }

  async _from_file(path, opts = {}) {
    const sloppy = !!opts.sloppy;
    const fileStream = createReadStream(path);
  
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let ctx = {
      games: [],  // parsed games
      game: { tags: [], moves: []},  // current game
      in_movetext: false, // line parsing status whether 'in movetext'
      movetext: '', // current collecting movetext
    };

    for await (const line of rl) {
      if(line)
        await this._handle_line(ctx, line, sloppy);
    }

    return ctx.games;
  }

  async _handle_line(ctx, line, sloppy) {
    const has_tag = line.trimStart().startsWith('[');
    if(ctx.in_movetext) {
      if(has_tag) {
        // parse movetext
        if(ctx.game.tags.length) {
          let fen = ctx.game.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
          ctx.game.moves = this._parse_movetext(ctx.movetext, fen, sloppy);
          ctx.games.push(ctx.game);

          ctx.game = { tags: [], moves: []}; // next cur game
        }
        ctx.in_movetext = false;
        ctx.movetext = '';
      }
      else {
        ctx.movetext += line;
      }
    }
    else {
      if(has_tag) {
        // parse tag
        let tag = line.match(/\[(\w+)\s+"([^"]+)"/);
        if (tag) {
          ctx.game.tags.push({ name: tag[1], value: tag[2] });
        }
      }
      else {
        // collect movetext
        ctx.movetext = line;
        ctx.in_movetext = true;
      }
    }

    // last movetext
    if(ctx.in_movetext) {
      // parse movetext
      if(ctx.game.tags.length) {
        let fen = ctx.game.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
        ctx.game.moves = this._parse_movetext(ctx.movetext, fen, sloppy);
        ctx.games.push(ctx.game);
      }
    }
  }

  _parse_movetext(movetext, fen = '', sloppy = false) {
    const parsedMoves = parse(movetext);  // syntax parse
    return this._make_moves(parsedMoves[0], fen, undefined, 1, sloppy);
  }

  _make_moves(parsedMoves, fen, parent = undefined, ply = 1, sloppy = false) {
    const chess = fen ? new Chess(fen) : new Chess()
    const moves = []
    let prevMove = parent
    for (let parsedMove of parsedMoves) {
      if (parsedMove.text) {
        const san = parsedMove.text.san;
        const move = chess.move(san, {sloppy: sloppy});

        if(parsedMove.num) {
          move.num = parsedMove.num;
        }
        else {
          if(prevMove&&prevMove.num)
            move.num = prevMove.num+(move.color=='w'?1:0);
        }

        if (move) {
          if (prevMove) {
            move.prev = prevMove
            prevMove.next = move
          } else {
            move.prev = undefined
          }
          move.ply = ply
          this._fill_stat(move, chess)
          if (parsedMove.nag) {
            move.nag = parsedMove.nag[0]
          }
          if(parsedMove.commentPre||parsedMove.commentBefore||parsedMove.commentAfter)
          {
            move.comment = {};
            if (parsedMove.commentPre) {
              move.comment.pre = parsedMove.commentPre
            }
            if (parsedMove.commentBefore) {
              move.comment.before = parsedMove.commentBefore
            }
            if (parsedMove.commentAfter) {
              move.comment.after = parsedMove.commentAfter
            }
          }
          move.vars = []
          const parsedVars = parsedMove.vars
          if (parsedVars.length > 0) {
            const lastFen = moves.length > 0 ? moves[moves.length - 1].fen : fen
            for (let parsedVar of parsedVars) {
              move.vars.push(this._make_moves(parsedVar, lastFen, prevMove, ply, sloppy))
            }
          }
          moves.push(move)
          prevMove = move
        } else {
          throw new "IllegalMoveException: " + chess.fen() + " + " + san;
        }
      }
      ply++;
    }
    return moves;
  }

  _fill_stat(move, chess) {
    move.fen = chess.fen()
    move.vars = []
    if (chess.isGameOver()) {
      move.over = {}
      if (chess.isCheckmate()) {
        move.over.mate = true;
      }
      else if (chess.isDraw()) {
        if (chess.isStalemate())
          move.over.draw = 'stale';
        else if (chess.isInsufficientMaterial())
          move.over.draw = 'material';
        else if (chess.isThreefoldRepetition())
          move.over.draw = '3fold';
        else
          move.over.draw = 'fifty';
      }
    }
    if (chess.isCheck()) {
      move.check = true
    }
  }
}