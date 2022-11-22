declare module "util" {
    export class Util {
        /**
         * @private
         */
        private static fill_move;
        /**
         * @private
         */
        private static move_num_from_fen;
    }
}
declare module "game" {
    export namespace VARMODE {
        const replace: string;
        const main: string;
        const next: string;
        const last: string;
    }
    export class Game {
        /** @type {Tag[]} */
        tags: Tag[];
        /** @type {Move[]} */
        moves: Move[];
        /** @type {string} */
        gtm: string;
        /** @type {Move} */
        cur: Move;
        /** @type {VARMODE} */
        varmode: {
            replace: string;
            main: string;
            next: string;
            last: string;
        };
        /**
         * get setup fen if there is
         * @return {string | undefined} fen
         */
        setupFen(): string | undefined;
        /**
         * set fen tag with setup tag
         * @param {string} fen
         * @return {void}
         */
        setFen(fen: string): void;
        /**
         * delete fen and setup tag
         * @return {void}
         */
        delFen(): void;
        /**
         * set a tag
         * @param {string} name
         * @param {string} value
         * @return {void}
         */
        setTag(name: string, value: string): void;
        /**
         * delete a tag, name is case insensitive
         * @param {string} name
         * @return {void}
         */
        delTag(_name: any): void;
        /**
         * return pgn string of the game
         * @return {void}
         */
        pgn(): void;
        /**
         * @private
         */
        private _moves_to_pgn;
        /**
         * add a move, this.cur will be updated if successful
         * @param {string} san            // short algebraic notation
         * @param {Move=} prev            // add after this move
         *                                // this.cur if undefined
         *                                // first move if null
         * @param {VARMODE=} varmode  // variation mode, 'varmode' if null
         */
        add(san: string, prev?: Move | undefined, varmode?: {
            replace: string;
            main: string;
            next: string;
            last: string;
        } | undefined): Move;
        /**
         * @private
         * @param {string} san
         * @param {Move[]} line to add
         * @return {Move | null}
         */
        private _add_to_line;
        /**
         * as the last variation
         * @private
         * @param {string} san
         * @param {Move | null} prev first move if null
         * @return {Move | null}
         */
        private _add_lastvar;
        /**
         * make others as variations
         * @private
         * @param {string} san
         * @param {Move | null} prev
         * @return {Move | null}
         */
        private _add_mainvar;
        /**
         * as the very next variation
         * @private
         * @param {string} san
         * @param {Move | null} prev first move if null
         * @return {Move | null}
         */
        private _add_nextvar;
        /**
         * no variation, overwrite
         * @private
         * @param {string} san
         * @param {Move | null} prev first move if null
         * @return {Move | null}
         */
        private _add_replace;
        /**
         * @private
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        private _make_move;
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
         * load a pgn file, or read from stdin if 'path' is '' or null
         * @param {string} path stdin if '' or null
         * @param {Options} opts
         * @return {Pgn}
         */
        static load(path: string, opts?: Options): Pgn;
        /**
         * parse a pgn string
         * @param {string} pgn
         * @param {Options} opts
         * @return {Pgn}
         */
        constructor(pgn?: string, opts?: Options);
        games: any[];
        /**
         * total number of games
         * @return {number}
         */
        count(): number;
        /**
         * get a game
         * @param {number} idx
         * @return {Game}
         */
        game(idx: number): Game;
        /**
         * add new game
         * @return {Game}
         */
        newgame(): Game;
        /**
         * return the pgn string of all games
         * @return {string}
         */
        pgn(): string;
        /**
         * @private
         */
        private _from_pgn;
        /**
         * @private
         */
        private _from_file;
        /**
         * @private
         */
        private _handle_line;
        /**
         * @private
         */
        private _parse_movetext;
        /**
         * @private
         * @return {Err}
         */
        private _make_moves;
    }
    import { Game } from "game";
}
type Tag = {
    name: string;
    valuee: string;
};
/**
 *
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