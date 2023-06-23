import NumericMatrix from './NumericMatrix.js';
import { distance, round, getPolygonAreaSize } from "../helpers.js";
export default class BinaryMatrix extends NumericMatrix {
    constructor(fill, width, height) {
        super(width, height);
        /**
         * Retrieve size of the array compared to the total number size of the map
         */
        this.getSizeFromPoint = function (startX, startY) {
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
                    }
                    else if (d === 1) {
                        sy++;
                    }
                    else if (d === 2) {
                        sx--;
                    }
                    else if (d === 3) {
                        sy--;
                    }
                    if (!this.filled(sx, sy)) {
                        coords.push([sx, sy]);
                        break;
                    }
                }
            }
            return Math.abs(getPolygonAreaSize(coords));
        };
        this.map(typeof fill === 'undefined' ? 0 : fill);
    }
    clone() {
        const matrix = new BinaryMatrix(0, this.width, this.height);
        matrix.__values = JSON.parse(JSON.stringify(this.__values));
        return matrix;
    }
    /**
     * Retrieve all cells that are filled
     */
    getFilledCells() {
        const cells = [];
        this.foreachFilled(function (x, y) {
            cells.push([x, y]);
        });
        return cells;
    }
    /**
     * Retrieve all cells that are not filled
     */
    getUnfilledCells() {
        const cells = [];
        this.foreachUnfilled(function (x, y) {
            cells.push([x, y]);
        });
        return cells;
    }
    /**
     * Fill the cell with the value
     */
    fill(x, y) {
        this.setCell(x, y, 1);
        return this;
    }
    /**
     * Remove filling the cell with the value
     */
    unfill(x, y) {
        this.setCell(x, y, 0);
        return this;
    }
    /**
     * Count the number of filled cells
     */
    countFilled() {
        let count = 0;
        this.foreachFilled(function () {
            count++;
        });
        return count;
    }
    /**
     * Check if matrix has filled cells
     */
    hasFilled() {
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
    filled(x, y) {
        return this.getCell(x, y) === 1;
    }
    /**
     * Applies the callback to the filled elements of the Matrix
     */
    foreachFilled(callback) {
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
    foreachUnfilled(callback) {
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
    distanceTo(x, y, max) {
        let result = Number.MAX_SAFE_INTEGER;
        const minX = Math.max(0, x - max), maxX = Math.min(this.width - 1, x + max), minY = Math.max(0, y - max), maxY = Math.min(this.height - 1, y + max);
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
    aroundFilled(x, y, max) {
        return max >= this.distanceTo(x, y, max);
    }
    /**
     * Apply binary "OR" between two binary matrix
     */
    combineWith(matrix) {
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
    diff(matrix) {
        const _this = this;
        matrix.foreachFilled(function (x, y) {
            _this.unfill(x, y);
        });
        return _this;
    }
    /**
     * Unfill cells which are filled in the specified array of cells
     */
    diffCells(cells) {
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
    getFilledNeighbors(x, y) {
        const result = [], _this = this;
        _this.foreachNeighbors(x, y, function (nx, ny) {
            if (_this.filled(nx, ny)) {
                result.push([nx, ny]);
            }
        });
        return result;
    }
    /**
     * Retrieve size of the array compared to the total number size of the map
     */
    getSize() {
        return round(this.getFilledCells().length / (this.width * this.height), 2) * 100;
    }
}
