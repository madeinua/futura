import Matrix from "./Matrix.js";
import {fromFraction, changeRange, round} from "../helpers.js";

export default class NumericMatrix extends Matrix {

    toString = function (): string {
        return JSON.stringify(
            this.__values
        );
    }

    fromString = function (string: string): void {
        this.setAll(
            JSON.parse(string)
        );
    }

    /**
     * Add value to a current cell value
     */
    addToCell(x: number, y: number, value: number): any {
        return this.setCell(x, y, this.getCell(x, y) + value);
    }

    /**
     * Subtract value from a current cell value
     */
    subtractFromCell(x: number, y: number, value: number): any {
        return this.setCell(x, y, this.getCell(x, y) - value);
    }

    /**
     * Compare current matrix to the other one
     */
    equals(matrix: NumericMatrix): boolean {
        return this.__values.toString() === matrix.__values.toString();
    }

    /**
     * Get matrix greyscale level
     */
    getGrayscale(x: number, y: number): number {
        return fromFraction(this.getCell(x, y), 0, 255);
    }

    /**
     * Count sum of all neighbors
     */
    sumNeighbors(x: number, y: number): number {

        let sum = 0;
        const _this: NumericMatrix = this;

        _this.foreachNeighbors(x, y, function (nx: number, ny: number): void {
            sum += _this.getCell(nx, ny);
        });

        return sum;
    }

    /**
     * Add value to all neighbors of the point [x, y]
     */
    addToNeighborCells(x: number, y: number, value: number): any {
        const _this: NumericMatrix = this;

        _this.foreachNeighbors(x, y, function (nx: number, ny: number): void {
            _this.addToCell(nx, ny, value);
        });

        return _this;
    }

    /**
     * Check if Matrix has at least one element with a specified value
     */
    has(value: number): boolean {

        let found = false;
        const _this: NumericMatrix = this;

        _this.foreach(function (x: number, y: number): void {
            if (_this.getCell(x, y) === value) {
                found = true;
            }
        });

        return found;
    }

    /**
     * Scale matrix to fit min/max ranges
     */
    setRange(min: number, max: number): any {

        const _this: NumericMatrix = this,
            values = _this.getValuesList(),
            currMin = Math.min(...values),
            currMax = Math.max(...values);

        _this.map(function (x: number, y: number): number {
            return changeRange(
                _this.getCell(x, y),
                currMin,
                currMax,
                min,
                max
            );
        });

        return _this;
    }

    /**
     * Retrieve minimum value
     */
    getMin(): number {
        return round(Math.min.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve maximum value
     */
    getMax(): number {
        return round(Math.max.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve average value
     */
    getAvgValue(): number {
        return round(this.getValuesList().reduce((a, b) => a + b, 0) / (this.width * this.height), 2);
    }
}