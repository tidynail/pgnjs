import { stdin } from 'node:process';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

import { parse } from './pgnparser.js';
import { Chess } from 'chess.js';
import { Game } from './game.js';
import { Util } from './util.js';

export class Pgn {
  /**
   * @param {string} path stdin if ''
   * @param {Options} opts
   * @return {Pgn} pgn
   */
  static async load(path, opts = {}) {
    let pgn = new Pgn('', opts);
    pgn.games = await pgn._from_file(path, opts);
    return pgn;
  }

  /**
   * @param {string} pgn
   * @param {Options} opts
   */
  constructor(pgn = '', opts = {}) {
    this.games = this._from_pgn(pgn, opts);
  }

  /**
   * @return {number}
   */
  count() {
    return this.games.length;
  }

  /**
   * @param {number} idx
   * @return {Game}
   */
  game(idx) {
    return (idx>=0&&idx<this.games.length?this.games[idx]:null);
  }

  /**
   * @return {Game}
   */
  newgame() {
    let game = new Game();
    this.games.push(game);
    return game;
  }

  pgn() {
    let text = '';
    this.games.forEach(game => {
      text += game.pgn() + '\n';
    });
    return text;
  }

  _from_pgn(pgn = '', opts = {}) {
    const lines = pgn.split('\n');    

    let ctx = {
      games: [],  // parsed games
      game: new Game(),  // current game
      in_movetext: false, // line parsing status whether 'in movetext'
      movetext: '', // current collecting movetext
    };

    for(const line of lines) {      
      this._handle_line(ctx, line + '\n', opts);
    }

    // last movetext
    if(ctx.in_movetext) {
      // parse movetext
      if(ctx.game.tags.length) {
        ctx.game.moves = [];
        let err = this._parse_movetext(ctx.game, ctx.movetext, ctx.game.setupFen(), opts);
        ctx.games.push(ctx.game);

        if(opts?.onGame)
          opts.onGame(ctx.game, err);
      }
    }

    if(opts?.onFinish)
      opts.onFinish();

    return ctx.games;
  }

  async _from_file(path, opts = {}) {  
    const rl = createInterface({
      input: path?createReadStream(path):stdin,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let ctx = {
      games: [],  // parsed games
      game: new Game(),  // current game
      in_movetext: false, // line parsing status whether 'in movetext'
      movetext: '', // current collecting movetext
    };

    for await (const line of rl) {
      if(line)
        await this._handle_line(ctx, line + '\n', opts);
    }

    // last movetext
    if(ctx.in_movetext) {
      // parse movetext
      if(ctx.game.tags.length) {
        ctx.game.moves = [];
        let err = this._parse_movetext(ctx.game, ctx.movetext, ctx.game.setupFen(), opts);
        ctx.games.push(ctx.game);

        if(opts?.onGame)
          opts.onGame(ctx.game, err);
      }
    }

    if(opts?.onFinish)
      opts.onFinish();
  
    return ctx.games;
  }

  async _handle_line(ctx, line, opts) {
    const has_tag = line.trimStart().startsWith('[');
    if(ctx.in_movetext) {
      if(has_tag) {
        // parse movetext
        if(ctx.game.tags.length) {
          ctx.game.moves = [];
          let err = this._parse_movetext(ctx.game, ctx.movetext, ctx.game.setupFen(), opts);
          ctx.games.push(ctx.game);

          if(opts?.onGame)
            opts.onGame(ctx.game, err);

          ctx.game = new Game(); // next cur game
        }
        ctx.in_movetext = false;
        ctx.movetext = '';

        // parse tag
        let tag = line.match(/\[(\w+)\s+"([^"]+)"/);
        if (tag) {
          ctx.game.tags.push({ name: tag[1], value: tag[2] });
        }
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
  }

  _parse_movetext(game, movetext, fen = '', opts = {}) {
    const verbose = !!opts?.verbose;
    let err = undefined;
    try{
      const parsed_moves = parse(movetext);  // syntax parse
      err = this._make_moves(game, game.moves, parsed_moves[0], fen, undefined, 1);
      if(err) {
        // error
        err.movetext = movetext;
        if(verbose) {
          console.error('error', err);
        }
      }
    } catch(e) {
      // exception from parser
      err = e;
      err.movetext = movetext;
      if(verbose) {
        console.error('error', err);
      }
    }
    return err;
  }

  /**
   * @return {error}
   */
  _make_moves(game, parent, parsed_moves, fen, prev_move, ply) {
    const chess = fen ? new Chess(fen) : new Chess()
    let moves = parent;
    for (let parsed_move of parsed_moves) {
      if (parsed_move.text) {
        const san = parsed_move.text.san;
        const move = chess.move(san, {sloppy: true});

        if (move) {
          move.line = parent;
          move.prev = prev_move;
          move.ply = ply
          Util.fill_move(move, chess)

          if(parsed_move.num) {
            move.num = parsed_move.num;
          }
          else {
            if(prev_move&&prev_move.num)
              move.num = prev_move.num+(move.color=='w'?1:0);
            else
              move.num = Util.move_num_from_fen(fen);
          }

          if (parsed_move.nags) {
            move.nags = [...new Set(parsed_move.nags)];
          }
          if(parsed_move.comment_pre||parsed_move.comment_before||parsed_move.comment_after)
          {
            move.comment = {};
            if (parsed_move.comment_pre) {
              move.comment.pre = parsed_move.comment_pre;
            }
            if (parsed_move.comment_before) {
              move.comment.before = parsed_move.comment_before;
            }
            if (parsed_move.comment_after) {
              move.comment.after = parsed_move.comment_after;
            }
          }
          move.vars = [];
          const parsedVars = parsed_move.vars;
          if (parsedVars.length > 0) {
            const lastFen = moves.length > 0 ? moves[moves.length - 1].fen : fen;
            for (let parsedVar of parsedVars) {
              let rav = [];
              let err = this._make_moves(game, rav, parsedVar, lastFen, prev_move, ply);
              if(rav.length>0)
                move.vars.push(rav);
              if(err)
                return err;
            }
          }
          moves.push(move);
          prev_move = move;
        } else {
          return {
            msg: 'Illegal move',
            fen: chess.fen(),
            san: san,
            num: prev_move?.num
          };
        }
      }
      else if(parsed_move.gtm) {
        game.gtm = parsed_move.gtm;
      }
      ply++;
    }
    return undefined;
  }
};