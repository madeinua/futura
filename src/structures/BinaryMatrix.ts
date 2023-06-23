import NumericMatrix from './NumericMatrix.js';
import {distance, round, getPolygonAreaSize} from "../helpers.js";
import {CellsList} from "./Cells.js";
import {Array2D} from "./Array2D.js";

export default class BinaryMatrix extends NumericMatrix {

    constructor(fill: 0 | 1, width: number, height: number) {
        super(width, height);

        this.map(
            typeof fill === 'undefined' ? 0 : fill
        );
    }

    clone(): BinaryMatrix {
        const matrix = new BinaryMatrix(0, this.width, this.height);
        matrix.__values = JSON.parse(JSON.stringify(this.__values));

        return matrix;
    }

    /**
     * Retrieve all cells that are filled
     */
    getFilledCells(): CellsList {
        const cells = [];

        this.foreachFilled(function (x: number, y: number): void {
            cells.push([x, y]);
        });

        return cells;
    }

    /**
     * Retrieve all cells that are not filled
     */
    getUnfilledCells(): CellsList {
        const cells = [];

        this.foreachUnfilled(function (x: number, y: number): void {
            cells.push([x, y]);
        });

        return cells;
    }

    /**
     * Fill the cell with the value
     */
    fill(x: number, y: number): this {
        this.setCell(x, y, 1);
        return this;
    }

    /**
     * Remove filling the cell with the value
     */
    unfill(x: number, y: number): this {
        this.setCell(x, y, 0);
        return this;
    }

    /**
     * Count the number of filled cells
     */
    countFilled(): number {
        let count = 0;

        this.foreachFilled(function (): void {
            count++;
        });

        return count;
    }

    /**
     * Check if matrix has filled cells
     */
    hasFilled(): boolean {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.filled(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if the cell is filled
     */
    filled(x: number, y: number): boolean {
        return this.getCell(x, y) === 1;
    }

    /**
     * Applies the callback to the filled elements of the Matrix
     */
    foreachFilled(callback: Function): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    /**
     * Applies the callback to the unfilled elements of the Matrix
     */
    foreachUnfilled(callback: Function): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    /**
     * Get the closest distance to the specified coordinates.
     * Note: max affect the performance dramatically!
     */
    distanceTo(x: number, y: number, max: number): number {

        let result = Number.MAX_SAFE_INTEGER;

        const minX = Math.max(0, x - max),
            maxX = Math.min(this.width - 1, x + max),
            minY = Math.max(0, y - max),
            maxY = Math.min(this.height - 1, y + max);

        for (let nx = minX; nx <= maxX; nx++) {
            for (let ny = minY; ny <= maxY; ny++) {
                if (this.filled(nx, ny)) {
                    result = Math.min(result, distance(nx, ny, x, y));
                }
            }
        }

        return result;
    }

    /**
     * Whether is any filled point around the specified coordinates.
     * Note: max affect the performance dramatically!
     */
    aroundFilled(x: number, y: number, max: number): boolean {
        return max >= this.distanceTo(x, y, max);
    }

    /**
     * Apply binary "OR" between two binary matrix
     */
    combineWith(matrix: BinaryMatrix): this {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.__values[x][y] = this.__values[x][y] || matrix.__values[x][y];
            }
        }

        return this;
    }

    /**
     * Unfill cells which are filled in the specified matrix
     */
    diff(matrix: BinaryMatrix): BinaryMatrix {
        const _this: BinaryMatrix = this;

        matrix.foreachFilled(function (x: number, y: number): void {
            _this.unfill(x, y);
        });

        return _this;
    }

    /**
     * Unfill cells which are filled in the specified array of cells
     */
    diffCells(cells: Array2D): BinaryMatrix {

        for (let i = 0; i < cells.length; i++) {
            if (this.filled(cells[i][0], cells[i][1])) {
                this.unfill(cells[i][0], cells[i][1]);
            }
        }

        return this;
    }

    /**
     * Retrieve all filled neighbors of the specified cell
     */
    getFilledNeighbors(x: number, y: number): CellsList {

        const result = [],
            _this: BinaryMatrix = this;

        _this.foreachNeighbors(x, y, function (nx: number, ny: number) {
            if (_this.filled(nx, ny)) {
                result.push([nx, ny]);
            }
        });

        return result;
    }

    /**
     * Retrieve size of the array compared to the total number size of the map
     */
    getSize(): number {
        return round(this.getFilledCells().length / (this.width * this.height), 2) * 100;
    }

    /**
     * Retrieve size of the array compared to the total number size of the map
     */
    getSizeFromPoint = function (startX: number, startY: number): number {

        if (!this.filled(startX, startY)) {
            return 0;
        }

        const coords = [];

        for (let d = 0; d < 4; d++) {

            let sx = startX;
            let sy = startY;

            while (true) {

                if (d === 0) {
                    sx++;
                } else if (d === 1) {
                    sy++;
                } else if (d === 2) {
                    sx--;
                } else if (d === 3) {
                    sy--;
                }

                if (!this.filled(sx, sy)) {
                    coords.push([sx, sy]);
                    break;
                }
            }
        }

        return Math.abs(
            getPolygonAreaSize(coords)
        );
    }
}