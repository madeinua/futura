import Matrix from "./Matrix.js";
import { fromFraction, changeRange, round } from "../helpers.js";
export default class NumericMatrix extends Matrix {
    constructor() {
        super(...arguments);
        this.toString = function () {
            return JSON.stringify(this.__values);
        };
        this.fromString = function (string) {
            this.setAll(JSON.parse(string));
        };
    }
    /**
     * Add value to a current cell value
     */
    addToCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) + value);
    }
    /**
     * Subtract value from a current cell value
     */
    subtractFromCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) - value);
    }
    /**
     * Compare current matrix to the other one
     */
    equals(matrix) {
        return this.__values.toString() === matrix.__values.toString();
    }
    /**
     * Get matrix greyscale level
     */
    getGrayscale(x, y) {
        return fromFraction(this.getCell(x, y), 0, 255);
    }
    /**
     * Count sum of all neighbors
     */
    sumNeighbors(x, y) {
        let sum = 0;
        const _this = this;
        _this.foreachNeighbors(x, y, function (nx, ny) {
            sum += _this.getCell(nx, ny);
        });
        return sum;
    }
    /**
     * Add value to all neighbors of the point [x, y]
     */
    addToNeighborCells(x, y, value) {
        const _this = this;
        _this.foreachNeighbors(x, y, function (nx, ny) {
            _this.addToCell(nx, ny, value);
        });
        return this;
    }
    /**
     * Check if Matrix has at least one element with a specified value
     */
    has(value) {
        let found = false;
        const _this = this;
        _this.foreach(function (x, y) {
            if (_this.getCell(x, y) === value) {
                found = true;
            }
        });
        return found;
    }
    /**
     * Scale matrix to fit min/max ranges
     */
    setRange(min, max) {
        const _this = this, values = _this.getValuesList(), currMin = Math.min(...values), currMax = Math.max(...values);
        _this.map(function (x, y) {
            return changeRange(_this.getCell(x, y), currMin, currMax, min, max);
        });
        return this;
    }
    /**
     * Retrieve minimum value
     */
    getMin() {
        return round(Math.min.apply(null, this.toList()), 2);
    }
    /**
     * Retrieve maximum value
     */
    getMax() {
        return round(Math.max.apply(null, this.toList()), 2);
    }
    /**
     * Retrieve average value
     */
    getAvgValue() {
        return round(this.getValuesList().reduce((a, b) => a + b, 0) / (this.width * this.height), 2);
    }
}
