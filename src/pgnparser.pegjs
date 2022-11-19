//
// install peggy as dev dependency
// npm i -D peggy
//
// run peggy
// npx peggy pgnparser.pegjs --format es -o pgnparser.js
//

{
  function toInt(o) {
    return parseInt(o.join(""), 10);
  }
}

pgn
  = move:move rest:move? ws_
    { var arr = (rest ? rest : []); 
      arr.unshift(move);
      return arr; }
  / ws_
    { return []; }

move
  = ws_ c_pre:comment? ws_ num:mvnum? ws_ c_before:comment? ws_
    text:san  ws_ nag:nags?  ws_ c_after:comment? ws_ rav:rav? rest:move?
    { var arr = (rest ? rest : []);
      var move = {}; 
      move.num = num;
      move.text = text;
      move.comment_pre = c_pre; 
      move.comment_before = c_before; 
      move.comment_after = c_after;
      move.vars = (rav ? rav : []); 
      move.nag = (nag ? nag : null); 
      arr.unshift(move); return arr; }
  / game_terminal_marker

game_terminal_marker
  = "1:0" { return ["1:0"]; }
  / "0:1" { return ["0:1"]; }
  / "1-0" { return ["1-0"]; }
  / "0-1" { return ["0-1"]; }
  / "1/2-1/2"  { return ["1/2-1/2"]; }
  / "*"  { return ["*"]; }

comment
  = '{' cmt:[^}]* '}' { return cmt.join("").trim(); }

rav
  = '(' rav:move ')' ws_ rest:rav? ws_ num:mvnum?
    { var arr = (rest ? rest : []); arr.unshift(rav); return arr; }

mvnum
    = num:integer ws_ "."* { return num; }

integer "integer"
    = digits:[0-9]+ { return toInt(digits); }

ws_
  = ws*

ws
  = ' '
  / '\t'
  / '\r'
  / '\n'

san
  = piece:piece? & checkdisc disc:discriminator capture:capture?
    col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.piece = (piece ? piece : null); hm.disc =  (disc ? disc : null); hm.capture = (capture ? capture : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.promotion = pr; hm.san = (piece ? piece : "") + (disc ? disc : "") + (capture ? capture : "") + col + row + (pr ? pr : "") + (ch ? ch : ""); return hm; }
  / piece:piece? cols:column rows:row capture:capture_or_dash? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.piece = (piece ? piece : null); hm.capture = (capture =='x' ? capture : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.san = (piece && (piece!=='P') ? piece : "") + cols + rows + (capture=='x' ? capture : "-") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; }
  / piece:piece? capture:capture? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.piece = (piece ? piece : null); hm.capture = (capture ? capture : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.san = (piece ? piece : "") + (capture ? capture : "") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; }
  / 'O-O-O' ch:check? { var hm = {}; hm.san = 'O-O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }
  / 'O-O' ch:check? { var hm = {}; hm.san = 'O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }

check
  = ch:(! '+-' '+') { return ch[1]; }
  / ch:(! '$$$' '#') { return ch[1]; }

promotion
  = '=' f:piece { return '=' + f; }

nags
  = nag:nag ws_ rest:nags? { var arr = (rest ? rest : []); arr.unshift(nag); return arr; }

nag
  = '$' num:integer { return '$' + num; }
  / '!!' { return '$3'; }
  / '??' { return '$4'; }
  / '!?' { return '$5'; }
  / '?!' { return '$6'; }
  / '!' { return '$1'; }
  / '?' { return '$2'; }
  / '‼' { return '$3'; }
  / '⁇' { return '$4'; }
  / '⁉' { return '$5'; }
  / '⁈' { return '$6'; }
  / '□' { return '$7'; }
  / '=' { return '$10'; }
  / '∞' { return '$13'; }
  / '⩲' { return '$14'; }
  / '⩱' { return '$15';}
  / '±' { return '$16';}
  / '∓' { return '$17';}
  / '+-' { return '$18';}
  / '-+' { return '$19';}
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
