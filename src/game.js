import { Chess } from 'chess.js';
import { Util } from './util.js';

export const VARMODE = {
  replace:  'replace',  // replace old move with new one, no variation
  main: 'main',         // becomes the mainline
  next: 'next',         // added as the next variation
  last: 'last'          // (default) added as the last variation
}

// some essential tags placed at the beginning
/**
 * @private
 */
const STDTAGS = [
  // Standard "Seven Tag Roster"
  "Event",
  "Site",
  "Date",
  "Round",
  "White",
  "Black",
  "Result",

  "Steup",
  "FEN",
];

/**
 * @private
 */
const QUICKNAG = {
  '$1': '!',
  '$2': '?',
  '$3': '!!',
  '$4': '??',
  '$5': '!?',
  '$6': '?!',
};

/**
 * @private
 */
const NAGSTR = {
  '$18': '+-',
  '$19': '-+',
};

export class Game {
  constructor() {
    /** @type {Tag[]} */
    this.tags = [];

    /** @type {Move[]} */
    this.moves = [];

    /** @type {string} */
    this.gtm = null;  // game termination mark

    /** @type {Move} */
    this.cur = null;
    /** @type {VARMODE} */
    this.varmode = VARMODE.last;
  }

  /**
   * get setup fen if there is
   * @return {string | undefined} fen
   */
  setupFen() {
    return this.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
  }

  /**
   * set fen tag with setup tag
   * @param {string} fen
   * @return {void}
   */
  setFen(fen) {
    this.delTag('FEN');
    this.delTag('SetUp');
    this.tags.push({name: 'FEN', value: fen});
    this.tags.push({name: 'SetUp', value: '1'});
  }

  /**
   * delete fen and setup tag
   * @return {void}
   */
  delFen() {
    this.delTag('FEN');
    this.delTag('Setup');
  }

  /**
   * set a tag
   * @param {string} name
   * @param {string} value
   * @return {void}
   */
  setTag(name, value) {
    this.delTag(name);
    this.tags.push({name: name, value: value});
  }

  /**
   * delete a tag, name is case insensitive
   * @param {string} name 
   * @return {void}
   */
  delTag(_name) {
    const i = this.tags.findIndex(tag => {return tag.name.toUpperCase()==_name.toUpperCase();});
    if(i>=0)
      this.tags.splice(i,1);
  }

  /**
   * return pgn string of the game
   * @return {void}
   */
  pgn() {
    let ctx = { out: '', line: '', _indent: 0,
      at$: function() { return (this.line.length<=this._indent); },
      nl: function() {
        if(ctx.line!=' '.repeat(ctx._indent)) {
          ctx.out += ctx.line + '\n';
          ctx.line = ' '.repeat(ctx._indent);
        }
      },
      indent: function() {
        if(ctx.line!=' '.repeat(ctx._indent))
          ctx.out += ctx.line + '\n';

        ctx._indent += 2;
        ctx.line = ' '.repeat(ctx._indent);
      },
      unindent: function() {
        ctx.out += ctx.line + '\n';
        ctx._indent -= 2;
        ctx.line = ' '.repeat(ctx._indent);
      },
      add: function(delim, s) { 
        if(!this.at$()) 
          ctx.line += delim; 
        ctx.line += s;

        if(ctx.line.length > 75)
          nl();
      },
    };

    STDTAGS.forEach(stdtag => {
      let value = this.tags.find(item => {item.name == stdtag})?.value;
      if(value)
        ctx.out += `[${stdtag} "${value}"]\n`
    });

    this.tags.forEach(tag => {
      if(!STDTAGS.find(item => {item == tag.name}))
        ctx.out += `[${tag.name} "${tag.value}"]\n`;
    });

    if(this.tags.length==0) {
      // default tag
      ctx.out += '[Event "?"]\n';
    }

    ctx.out += '\n';

    this._moves_to_pgn(ctx, this.moves);

    // game termination mark
    let endmark = this.gtm;
    if(!endmark) {
      endmark = '*';
      let last_move = this.moves.length?this.moves[this.moves.length-1]:null;
      if(last_move?.over) {
        if(last_move.over.mate) {
          endmark = last_move.color=='w'?'1-0':'0-1';
        }
        else {
          endmark = '1/2-1/2';
        }
      }
    }

    ctx.add(' ', endmark);
    ctx.nl();
    
    return ctx.out;
  }

  /**
   * @private
   */
  _moves_to_pgn(ctx, moves) {
    let firstmove = true;
    let white_had_comment = false;
    let white_had_variation = false;
    moves.forEach(move => {

      if(move.comment&&move.comment.pre) {
        ctx.nl();
        ctx.add('', `{ ${move.comment.pre} }`);
        ctx.nl();
      }

      if(move.color=='w' || firstmove ||
         (move.color=='b'&&move.comment&&(move.comment.pre||move.comment.before))||
         (move.color=='b'&&white_had_comment) ||
         (move.color=='b'&&white_had_variation)) {

        ctx.add(' ', (move.color=='w'?`${move.num}.`:`${move.num}...`));

        if(move.comment&&move.comment.before) {
          ctx.add(' ', `{ ${move.comment.before} } `);
        }
      }
      else {
        if(move.comment&&move.comment.before) {
          ctx.add(' ', `{ ${move.comment.before} }`);
        }

        ctx.add(' ', '');
      }
      ctx.add('', move.san);

      if(move.nags) {
        move.nags.forEach((nag,idx) =>{
          if(QUICKNAG[nag]) {
            ctx.add(idx>0?' ':'', `${QUICKNAG[nag]}`);
          }
          else {
            ctx.add(' ', `${NAGSTR[nag]?NAGSTR[nag]:nag}`);
          }
        });
      }

      if(move.comment&&move.comment.after) {
        ctx.add(' ', `{ ${move.comment.after} }`);
      }

      if(move.vars.length) {
        move.vars.forEach(rav => {
          ctx.indent();

          ctx.line += '(';
          this._moves_to_pgn(ctx, rav);        
          ctx.add(' ', ')');

          ctx.unindent();
        });
      }

      white_had_comment = (move.color=='w'&&move.comment&&move.comment.after);
      white_had_variation = (move.color=='w'&&move.vars?.length>0);
      firstmove = false;
    });
  }

  /**
   * add a move, this.cur will be updated if successful
   * @param {string} san            // short algebraic notation
   * @param {Move=} prev            // add after this move
   *                                // this.cur if undefined
   *                                // first move if null
   * @param {VARMODE=} varmode  // variation mode, 'varmode' if null
   */
  add(san, prev, varmode) {
    let prev_move = prev===undefined?this.cur:prev;
    let line = prev_move?prev_move.line:this.moves;
    let iprev = prev_move?line.indexOf(prev_move):-1;
    let oldmove = (iprev+1)<line.length?line[iprev+1]:null;

    let move;
    if(oldmove) {
      let vm = varmode?varmode:this.varmode;

      // variation
      switch(vm) {
        case VARMODE.replace: move = this._add_replace(san, prev_move); break;
        case VARMODE.main: move = this._add_mainvar(san, prev_move); break;
        case VARMODE.next: move = this._add_nextvar(san, prev_move); break;
        default:
        case VARMODE.last: move = this._add_lastvar(san, prev_move); break;
      }
    }
    else {
      // append to the line
      move = this._add_to_line(san, line);
    }

    if(move)
      this.cur = move;
    
    return move;
  }

  /**
   * @private
   * @param {string} san
   * @param {Move[]} line to add
   * @return {Move | null}
   */
  _add_to_line(san, line) {
    let last_move = line.length?line[line.length-1]:null;

    let move = this._make_move(san, last_move);
    if(!move)
      return null;

    // fill extends
    move.line = line;
    line.push(move);
    return move;
  }

  /**
   * as the last variation
   * @private
   * @param {string} san
   * @param {Move | null} prev first move if null
   * @return {Move | null}
   */
  _add_lastvar(san, prev) {
    let line = prev?prev.line:this.moves;
    let iprev = prev?line.indexOf(prev):-1;
    let oldmove = line[iprev+1];

    let move = this._make_move(san, prev);
    if(!move)
      return null;

    if(!oldmove.vars)
      oldmove.vars = [];
    let rav = [];
    oldmove.vars.push(rav);

    move.line = rav;
    rav.push(move);
    return move;
  }

  /**
   * make others as variations
   * @private
   * @param {string} san
   * @param {Move | null} prev
   * @return {Move | null}
   */
   _add_mainvar(san, prev) {
    let line = prev?prev.line:this.moves;
    let iprev = prev?line.indexOf(prev):-1;

    let move = this._make_move(san, prev);
    if(!move)
      return null;

    let rav = line.splice(iprev+1);
    rav.forEach(move => {move.line = rav;});

    move.vars=[];
    move.vars.push(rav);

    // move all varations
    while(rav[0].vars?.length)
      move.vars.push(rav[0].vars.shift());

    move.line = line;
    line.push(move);
    return move;
  }

  /**
   * as the very next variation
   * @private
   * @param {string} san
   * @param {Move | null} prev first move if null
   * @return {Move | null}
   */
  _add_nextvar(san, prev) {
    let line =prev?prev.line:this.moves;
    let iprev = prev?line.indexOf(prev):-1;
    let oldmove = line[iprev+1];

    let move = this._make_move(san, prev);
    if(!move)
      return null;

    if(!oldmove.vars)
      oldmove.vars = [];
    let rav = [];
    oldmove.vars.unshift(rav);

    move.line = rav;
    rav.push(move);
    return move;
  }

  /**
   * no variation, overwrite
   * @private
   * @param {string} san
   * @param {Move | null} prev first move if null
   * @return {Move | null}
   */
  _add_replace(san, prev) {
    let line = prev?prev.line:this.moves;
    let iprev = prev?line.indexOf(prev):-1;
    line.splice(iprev+1);
    return this.move(san, line);
  }

  /**
   * @private
   * @param {string} san
   * @param {Move?} prev first move if null
   * @return {Move | null}
   */
  _make_move(san, prev) {
    let fen = prev?prev.fen:this.setupFen();

    const chess = new Chess(fen);
    let move = chess.move(san, {sloppy: true});
    if(!move)
      return null;

    // fill extends
    move.ply = prev?prev.ply+1:1;
    move.prev = prev;
    Util.fill_move(move, chess);

    if(prev&&prev.num)
      move.num = prev.num+(move.color=='w'?1:0);
    else {
      move.num = Util.move_num_from_fen(fen);
    }

    return move;
  }
};
