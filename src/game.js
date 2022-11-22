import { Chess } from 'chess.js';
import { Util } from './util.js';

// when there is already a move, how insertion will work
export const NOVAR = 'novar'; // (default) modify only, no variation change
export const VAR = {
  remove: 'remove',   
  replace: 'prevvar',  // make existing one as next variation
  nextvar: 'nextvar',  // added as the next variation
  lastvar: 'lastvar'   // added as the last variation
}

// some essential tags placed at the beginning
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

const QUICKNAG = {
  '$1': '!',
  '$2': '?',
  '$3': '!!',
  '$4': '??',
  '$5': '!?',
  '$6': '?!',
};

const NAGSTR = {
  '$18': '+-',
  '$19': '-+',
};

export class Game {
  constructor() {
    this.tags = [];
    this.moves = [];
    this.gtm = null;  // game termination mark
  }

  /**
   * @return {string | undefined} fen
   */
  setupFen() {
    return this.tags.find(tag => tag.name.toUpperCase() == 'FEN')?.value;
  }

  /**
   * @param {string} fen
   */
  setFen(fen) {
    this.delTag('FEN');
    this.delTag('SetUp');
    this.tags.push({name: 'FEN', value: fen});
    this.tags.push({name: 'SetUp', value: '1'});
  }

  /**
   * @param {string} name
   * @param {string} value
   */
  setTag(_name, _value) {
    this.delTag(_name);
    this.tags.push({name: _name, value: _value});
  }

  /**
   * @param {string} name 
   */
  delTag(_name) {
    const i = this.tags.findIndex(tag => {return tag.name.toUpperCase()==_name.toUpperCase();});
    if(i>=0)
      this.tags.splice(i,1);
  }

  pgn() {
    let ctx = { out: '', line: '', indent: 0,
      at$: function() { return (this.line.length<=this.indent); },
      delimit: function(s) { if(!this.at$()) ctx.line += ' '; },
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

    ctx.delimit(' ');
    ctx.line += endmark + '\n'; 

    ctx.out += ctx.line;
    ctx.line = '';

    return ctx.out;
  }

  _moves_to_pgn(ctx, moves) {
    let firstmove = true;
    let white_had_comment = false;
    let white_had_variation = false;
    moves.forEach(move => {

      if(move.comment&&move.comment.pre) {
        ctx.delimit(' ');
        ctx.line += `{ ${move.comment.pre} }`;
      }

      if(move.color=='w' || firstmove ||
         (move.color=='b'&&move.comment&&(move.comment.pre||move.comment.before))||
         (move.color=='b'&&white_had_comment) ||
         (move.color=='b'&&white_had_variation)) {

        ctx.delimit(' ');
        ctx.line += (move.color=='w'?`${move.num}.`:`${move.num}...`);

        if(move.comment&&move.comment.before) {
          ctx.delimit(' ');
          ctx.line += `{ ${move.comment.before} } `;
        }
      }
      else {
        if(move.comment&&move.comment.before) {
          ctx.delimit(' ');
          ctx.line += `{ ${move.comment.before} }`;
        }

        ctx.delimit(' ');
      }
      ctx.line += move.san;

      if(move.nags) {
        move.nags.forEach((nag,idx) =>{
          if(QUICKNAG[nag]) {
            if(idx>0)
              ctx.delimit(' ');
            ctx.line += `${QUICKNAG[nag]}`;
          }
          else {
            ctx.delimit(' ');
            ctx.line += `${NAGSTR[nag]?NAGSTR[nag]:nag}`;
          }
        });
      }

      if(move.comment&&move.comment.after) {
        ctx.delimit(' ');
        ctx.line += `{ ${move.comment.after} }`;
      }

      if(move.vars.length) {
        move.vars.forEach(rav => {
          if(ctx.line!=' '.repeat(ctx.indent))
            ctx.out += ctx.line + '\n';

          ctx.indent += 2;
          ctx.line = ' '.repeat(ctx.indent);

          ctx.line += '(';
          this._moves_to_pgn(ctx, rav);        
          ctx.delimit(' ');
          ctx.line += ')';
          ctx.out += ctx.line + '\n';
          ctx.indent -= 2;
          ctx.line = ' '.repeat(ctx.indent);
        });
      }

      if(ctx.line.length > 75) {
        ctx.out += ctx.line + '\n';
        ctx.line = ' '.repeat(ctx.indent);
      }

      white_had_comment = (move.color=='w'&&move.comment&&move.comment.after);
      white_had_variation = (move.color=='w'&&move.vars?.length>0);
      firstmove = false;
    });
  }

  /**
   * @param {string} san
   * @param {Move[]?} line to add
   * @return {Move | null}
   */
  move(san, line) {
    let moves = line?line:this.moves;
    let last_move = moves.length?moves[moves.length-1]:null;

    let move = this._make_move(san, last_move);
    if(!move)
      return null;

    // fill extends
    move.line = moves;
    moves.push(move);
    return move;
  }

  /**
   * as the last variation
   * @param {string} san
   * @param {Move?} prev first move if null
   * @return {Move | null}
   */
  var(san, prev = undefined) {
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
   * @param {string} san
   * @param {Move?} prev first move if null
   * @return {Move | null}
   */
   main(san, prev = undefined) {
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
   * @param {string} san
   * @param {Move?} prev first move if null
   * @return {Move | null}
   */
  next(san, prev = undefined) {
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
   * @param {string} san
   * @param {Move?} prev first move if null
   * @return {Move | null}
   */
  replace(san, prev = undefined) {
    let line = prev?prev.line:this.moves;
    let iprev = prev?line.indexOf(prev):-1;
    line.splice(iprev+1);
    return this.move(san, line);
  }

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
