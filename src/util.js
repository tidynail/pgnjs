export class Util {
  static fill_move(move, chess) {
    move.fen = chess.fen()
    move.uci = move.from + move.to + (move.flags=='p'?move.promotion:'');

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
};

