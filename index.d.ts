declare module "util" {
    export class Util {
        static fill_move(move: any, chess: any): void;
        static move_num_from_fen(fen: any): number;
    }
}
declare module "game" {
    export const NOVAR: "novar";
    export namespace VAR {
        const remove: string;
        const replace: string;
        const nextvar: string;
        const lastvar: string;
    }
    export class Game {
        tags: any[];
        moves: any[];
        gtm: any;
        /**
         * @return {string | undefined} fen
         */
        setupFen(): string | undefined;
        /**
         * @param {string} fen
         */
        setFen(fen: string): void;
        /**
         * @param {string} name
         * @param {string} value
         */
        setTag(_name: any, _value: any): void;
        /**
         * @param {string} name
         */
        delTag(_name: any): void;
        pgn(): string;
        _moves_to_pgn(ctx: any, moves: any): void;
        /**
         * @param {string} san
         * @param {Move[]?} line to add
         * @return {Move | null}
         */
        move(san: string, line: Move[] | null): Move | null;
        /**
         * as the last variation
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        var(san: string, prev?: Move | null): Move | null;
        /**
         * make others as variations
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        main(san: string, prev?: Move | null): Move | null;
        /**
         * as the very next variation
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        next(san: string, prev?: Move | null): Move | null;
        /**
         * no variation, overwrite
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        replace(san: string, prev?: Move | null): Move | null;
        _make_move(san: any, prev: any): import("chess.js").Move;
    }
}
declare module "pgnparser" {
    function peg$SyntaxError(message: any, expected: any, found: any, location: any): any;
    class peg$SyntaxError {
        constructor(message: any, expected: any, found: any, location: any);
        format(sources: any): string;
    }
    namespace peg$SyntaxError {
        function buildMessage(expected: any, found: any): string;
    }
    function peg$parse(input: any, options: any): any;
    export { peg$SyntaxError as SyntaxError, peg$parse as parse };
}
declare module "pgn" {
    export class Pgn {
        /**
         * @param {string} path stdin if ''
         * @param {Options} opts
         * @return {Pgn} pgn
         */
        static load(path: string, opts?: Options): Pgn;
        /**
         * @param {string} pgn
         * @param {Options} opts
         */
        constructor(pgn?: string, opts?: Options);
        games: any[];
        /**
         * @return {number}
         */
        count(): number;
        /**
         * @param {number} idx
         * @return {Game}
         */
        game(idx: number): Game;
        /**
         * @return {Game}
         */
        newgame(): Game;
        pgn(): string;
        _from_pgn(pgn?: string, opts?: {}): any[];
        _from_file(path: any, opts?: {}): Promise<any[]>;
        _handle_line(ctx: any, line: any, opts: any): Promise<void>;
        _parse_movetext(game: any, movetext: any, fen?: string, opts?: {}): any;
        /**
         * @return {error}
         */
        _make_moves(game: any, parent: any, parsed_moves: any, fen: any, prev_move: any, ply: any): error;
    }
    import { Game } from "game";
}
type Tag = {
    name: string;
    valuee: string;
};
/**
 * from chess.js
 */
type Move = {
    /**
     * 'w', 'b'
     */
    color: string;
    /**
     * square
     */
    from: string;
    /**
     * square
     */
    to: string;
    /**
     * 'n' - a non-capture
     * 'b' - a pawn push of two squares
     * 'e' - an en passant capture
     * 'c' - a standard capture
     * 'p' - a promotion
     * 'k' - kingside castling
     * 'q' - queenside castling
     */
    flags: string;
    /**
     * p, b, n, r, q, k
     */
    piece: string;
    /**
     * SAN notation
     */
    san: string;
    captured?: string | undefined;
    /**
     * extended by pgn.js
     */
    promotion?: string | undefined;
    /**
     * move number, not ply
     */
    num: number;
    /**
     * position fen
     */
    fen: string;
    /**
     * uci long algerbraic notation
     */
    uci: string;
    comment?: any | undefined;
    /**
     * comment before move number
     */
    pre?: string | undefined;
    /**
     * comment before san
     */
    before?: string | undefined;
    /**
     * comment after san and nag
     */
    after?: string | undefined;
    nags: string[];
    /**
     * variations (RAV)
     */
    vars: Move[][];
    over?: any | undefined;
    /**
     * checkmate
     */
    mate?: boolean | undefined;
    /**
     * 'stale', '3fold', 'fifty', 'material'
     */
    draw?: string | undefined;
    ply: number;
    /**
     * the line contaning this move
     */
    line: Move[];
    /**
     * previous move
     */
    prev: Move;
};
type Err = {
    msg?: string | undefined;
    fen?: string | undefined;
    san?: string | undefined;
    num?: number | undefined;
    /**
     * from parser
     */
    movetext?: string | undefined;
    /**
     * unexpected token
     */
    found?: string | undefined;
    location?: any | undefined;
    start: {
        offset: number;
        line: number;
        column: number;
    };
    offset: number;
    line: number;
    column: number;
};
type OnGame = (game: Game, error: Err) => void;
type OnFinish = () => void;
type Options = {
    /**
     * print error message
     */
    verbose?: boolean | undefined;
    /**
     * called when a game is parsed
     */
    onGame: OnGame;
    onFinish: OnFinishe;
};
//# sourceMappingURL=index.d.ts.map