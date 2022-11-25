//
// # install peggy
// install peggy as dev dependency
// npm i -D peggy
//
// # run peggy
// npx peggy pgnparser.pegjs --format es -o pgnparser.js
//

{
  function toInt(o) {
    return parseInt(o.join(""), 10);
  }
}

pgn
  = move:move rest:move? ws*
    { var arr = (rest ? rest : []); 
      arr.unshift(move);
      return arr; }
  / ws*
    { return [[]]; }

move
  = ws* c_pre:comment? ws* num:mvnum? ws* c_before:comment? ws*
    text:san ws* nags:nags? ws* c_after:comment? ws* rav:rav? rest:move?
    { var arr = (rest ? rest : []);
      var move = {}; 
      move.num = num;
      move.text = text;
      move.comment_pre = c_pre; 
      move.comment_before = c_before; 
      move.comment_after = c_after;
      move.vars = (rav ? rav : []); 
      move.nags = (nags ? nags : null); 
      arr.unshift(move); return arr; }
  / gtm:game_terminal_marker?
    { return gtm; }

game_terminal_marker
  = "1:0" { var move = { gtm: "1-0" }; return [move]; }
  / "0:1" { var move = { gtm: "0-1" }; return [move]; }
  / "1-0" { var move = { gtm: "1-0" }; return [move]; }
  / "0-1" { var move = { gtm: "0-1" }; return [move]; }
  / "1/2-1/2"  { var move = { gtm: "1/2-1/2" }; return [move]; }
  / "*"  { var move = { gtm: "*" }; return [move]; }

comment
  = '{' cmt:[^}]* '}' { return cmt.join("").trim(); }

rav
  = '(' rav:move ')' ws* rest:rav?
    { var arr = (rest ? rest : []); arr.unshift(rav); return arr; }
  / '(' ws* ')'
    { var arr = []; return arr; }

mvnum
    = num:number { return num; }

number
    = first:nonzero digits:[0-9]* { digits.unshift(first); return toInt(digits); }

nonzero
    = digit:[1-9] { return digit; }
    
ws
  = ' '
  / '\t'
  / '\r'
  / '\n'
  / ','
  / '.'

san
  = piece:piece? & checkdisc disc:discriminator capture:capture?
    col:column row:row pr:promotion? ch:check?
    { var san = {}; san.piece = (piece ? piece : null); san.disc =  (disc ? disc : null); san.capture = (capture ? capture : null); san.col = col; san.row = row; san.check = (ch ? ch : null); san.promotion = pr; san.san = (piece ? piece : "") + (disc ? disc : "") + (capture ? capture : "") + col + row + (pr ? pr : "") + (ch ? ch : ""); return san; }
  / piece:piece? capture:capture? col:column row:row pr:promotion? ch:check?
    { var san = {}; san.piece = (piece ? piece : null); san.capture = (capture ? capture : null); san.col = col; san.row = row; san.check = (ch ? ch : null); san.san = (piece ? piece : "") + (capture ? capture : "") + col  + row + (pr ? pr : "") + (ch ? ch : ""); san.promotion = pr; return san; }
  / 'O-O-O' ch:check? { var san = {}; san.san = 'O-O-O'+ (ch ? ch : ""); san.check = (ch ? ch : null); return  san; }
  / 'O-O' ch:check? { var san = {}; san.san = 'O-O'+ (ch ? ch : ""); san.check = (ch ? ch : null); return  san; }
  / '0-0-0' ch:check? { var san = {}; san.san = 'O-O-O'+ (ch ? ch : ""); san.check = (ch ? ch : null); return  san; }
  / '0-0' ch:check? { var san = {}; san.san = 'O-O'+ (ch ? ch : ""); san.check = (ch ? ch : null); return  san; }

check
  = ch:'+' { return ch; }
  / ch:'#' { return ch; }

promotion
  = '=' f:piece { return '=' + f; }

nags
  = nag:nag ws* rest:nags? { var arr = (rest ? rest : []); arr.unshift(nag); return arr; }

nag
  = '$' num:number { return '$' + num; }
  / '!!' { return '!!'; }
  / '??' { return '??'; }
  / '!?' { return '!?'; }
  / '?!' { return '?!'; }
  / '!' { return '!'; }
  / '?' { return '?'; }
  / '‼' { return '!!'; }
  / '⁇' { return '??'; }
  / '⁉' { return '!?'; }
  / '⁈' { return '?!'; }
  / '□' { return '$7'; }
  / '=' { return '$10'; }
  / '∞' { return '$13'; }
  / '⩲' { return '$14'; }
  / '⩱' { return '$15';}
  / '±' { return '$16';}
  / '∓' { return '$17';}
  / '+-' { return '+-';}
  / '-+' { return '-+';}
  / '⨀' { return '$22'; }
  / '⟳' { return '$32'; }
  / '→' { return '$36'; }
  / '↑' { return '$40'; }
  / '⇆' { return '$132'; }
  / 'D' { return '$220'; }

discriminator
  = column
  / row

checkdisc
  = discriminator capture? column row

piece
  = [RNBQKP]

column
  = [a-h]

row
  = [1-8]

capture
  = 'x'

capture_or_dash
  = 'x'
  / '-'
