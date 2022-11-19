import { parse } from "./pgnparser.js"
import { Chess } from "chess.js"

export class Pgn {
  constructor(pgn = '', options = {}) {
    this.games = this._from_pgn(pgn, options);
  }

  _from_pgn(pgn = '', options = {}) {
    const sloppy = !!options.sloppy;
    const lines = pgn.split('\n');
    let in_movetext = false;
    let movetext = '';

    let games = [];
    let game = { tags: [], moves: []};  // current game
    for(const line of lines) {
      const has_tag = line.trimStart().startsWith('[');
      if(in_movetext) {
        if(has_tag) {
          // parse movetext
          if(game.tags.length) {
            let fen = game.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
            game.moves = this._parse_movetext(movetext, fen, sloppy);
            games.push(game);

            game = { tags: [], moves: []}; 
          }
          in_movetext = false;
          movetext = '';
        }
        else {
          movetext += line + '\n';
        }
      }
      else {
        if(has_tag) {
          // parse tag
          let tag = line.match(/\[(\w+)\s+"([^"]+)"/);
          if (tag) {
            game.tags.push({ name: tag[1], value: tag[2] });
          }
        }
        else {
          movetext = line + '\n';
          in_movetext = true;
        }
      }
    }

    // last movetext
    if(in_movetext) {
      // parse movetext
      if(game.tags.length) {
        let fen = game.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
        game.moves = this._parse_movetext(movetext, fen, sloppy);
        games.push(game);
      }
    }
    return games;
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
      move.gameOver = true
      if (chess.inDraw()) {
        move.inDraw = true
      }
      if (chess.InStalemate()) {
        move.inStalemate = true
      }
      if (chess.insufficientMaterial()) {
        move.insufficientMaterial = true
      }
      if (chess.inThreefoldRepetition()) {
        move.inThreefoldRepetition = true
      }
      if (chess.inCheckmate()) {
        move.inCheckmate = true
      }
    }
    if (chess.inCheck()) {
      move.inCheck = true
    }
  }
}