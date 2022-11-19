/**
 * Young-Jo Song <tidynail@gmail.com>
 *  - updated chess.js to latest
 *
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-pgn
 * License: MIT, see file 'LICENSE' 
 */ 
import { parse } from "./pgnparser.js"
import { Chess } from "chess.js"

function IllegalMoveException(fen, san) {
    this.fen = fen
    this.san = san
    this.toString = function () {
        return "IllegalMoveException: " + fen + " + " + san
    }
}

export class History {

    constructor(historyString = undefined, setUpFen = undefined, sloppy = false) {
        if (!historyString) {
            this.clear()
        } else {
            const parsedMoves = parse(historyString)
            this.moves = this.traverse(parsedMoves[0], setUpFen, undefined, 1, sloppy)
        }
        this.setUpFen = setUpFen
    }

    clear() {
        this.moves = []
    }

    traverse(parsedMoves, fen, parent = undefined, ply = 1, sloppy = false) {
        const chess = fen ? new Chess(fen) : new Chess() // chess.js must be included in HTML
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
                    this.fillMoveFromChessState(move, chess)
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
                            move.vars.push(this.traverse(parsedVar, lastFen, prevMove, ply, sloppy))
                        }
                    }
                    moves.push(move)
                    prevMove = move
                } else {
                    throw new IllegalMoveException(chess.fen(), san)
                }
            }
            ply++
        }
        return moves
    }

    fillMoveFromChessState(move, chess) {
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

    /**
     * @param move
     * @return the history to the move which may be in a variation
     */
    historyToMove(move) {
        const moves = []
        let pointer = move
        moves.push(pointer)
        while (pointer.prev) {
            moves.push(pointer.prev)
            pointer = pointer.prev
        }
        return moves.reverse()
    }

    /**
     * Don't add the move, just validate, if it would be correct
     * @param san
     * @param previ
     * @param sloppy
     * @returns {[]|{}}
     */
    validateMove(san, prev = undefined, sloppy = true) {
        if (!prev) {
            if (this.moves.length > 0) {
                prev = this.moves[this.moves.length - 1]
            }
        }
        const chess = new Chess(this.setUpFen ? this.setUpFen : undefined)
        if (prev) {
            const historyToMove = this.historyToMove(prev)
            for (const moveInHistory of historyToMove) {
                chess.move(moveInHistory)
            }
        }
        const move = chess.move(san, {sloppy: sloppy})
        if(move) {
            this.fillMoveFromChessState(move, chess)
        }
        return move
    }

    addMove(san, prev = undefined, sloppy = true) {
        if (!prev) {
            if (this.moves.length > 0) {
                prev = this.moves[this.moves.length - 1]
            }
        }
        const move = this.validateMove(san, prev, sloppy)
        if (!move) {
            throw new Error("invalid move")
        }
        // this.fillMoveFromChessState(move, chess)
        if (prev) {
            move.prev = prev
            move.ply = prev.ply + 1
            if (prev.next) {
                prev.next.vars.push([])
            } else {
                prev.next = move
            }
        } else {
            move.ply = 1
            this.moves.push(move)
        }
        return move
    }

    render() {
        // TODO Variants
        let rendered = "";
        // let i = 0
        for (const move of this.moves) {
           rendered += move.san + " "
        }
        return rendered
    }

}
