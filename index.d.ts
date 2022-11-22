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
        var(san: string, prev?: Move): Move | null;
        /**
         * make others as variations
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        main(san: string, prev?: Move): Move | null;
        /**
         * as the very next variation
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        next(san: string, prev?: Move): Move | null;
        /**
         * no variation, overwrite
         * @param {string} san
         * @param {Move?} prev first move if null
         * @return {Move | null}
         */
        replace(san: string, prev?: Move): Move | null;
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
//# sourceMappingURL=index.d.ts.map