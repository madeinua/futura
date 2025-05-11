import { getAroundRadius, getRectangleAround } from "./Cells.js";
import { create2DArray } from "./Array2D.js";
/**
 * Matrix<T>
 * A generic 2D matrix wrapper.
 */
export default class Matrix {
    constructor(width, height, defaultValue) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(width, height, defaultValue !== null && defaultValue !== void 0 ? defaultValue : null);
    }
    /**
     * Returns the underlying 2D array.
     */
    getValues() {
        return this.__values;
    }
    /**
     * Returns all cell values as a flat array.
     */
    getValuesList() {
        const total = this.width * this.height;
        const values = new Array(total);
        let index = 0;
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                values[index++] = __values[x][y];
            }
        }
        return values;
    }
    /**
     * Sets all cells to the specified value.
     */
    set(value) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                __values[x][y] = value;
            }
        }
        return this;
    }
    /**
     * Sets a single cell value.
     */
    setCell(x, y, value) {
        this.__values[x][y] = value;
        return this;
    }
    /**
     * Retrieves a cell value.
     */
    getCell(x, y) {
        return this.__values[x][y];
    }
    /**
     * Returns the matrix width.
     */
    getWidth() {
        return this.width;
    }
    /**
     * Returns the matrix height.
     */
    getHeight() {
        return this.height;
    }
    /**
     * Applies the callback to each cell and stores the result.
     * If a non‑function value is provided, that value is used to set every cell.
     */
    map(callbackOrValue) {
        const isFunc = typeof callbackOrValue === "function";
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                __values[x][y] = isFunc
                    ? callbackOrValue(x, y)
                    : callbackOrValue;
            }
        }
        return this;
    }
    /**
     * Executes the callback for each cell.
     */
    foreach(callback) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(x, y);
            }
        }
    }
    /**
     * Executes the callback for each cell, passing in the cell’s value.
     */
    foreachValues(callback) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(__values[x][y], x, y);
            }
        }
    }
    /**
     * Executes the callback for each non-null cell.
     */
    foreachFilledValues(callback) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v !== null) {
                    callback(v, x, y);
                }
            }
        }
    }
    /**
     * Replaces the entire underlying 2D array.
     */
    setAll(values) {
        this.__values = values;
        return this;
    }
    /**
     * Resets the matrix to a new array with all cells set to null.
     */
    unsetAll() {
        this.__values = create2DArray(this.width, this.height, null);
        return this;
    }
    /**
     * Returns the neighbors around a cell using a rectangular pattern.
     */
    getNeighbors(x, y) {
        return getRectangleAround(x, y, this.width, this.height);
    }
    /**
     * Executes the callback for each neighbor.
     */
    foreachNeighbors(x, y, callback, stopOnTrue = false) {
        const neighbors = this.getNeighbors(x, y);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                break;
            }
        }
        return this;
    }
    /**
     * Returns the cells around a given cell within the specified radius.
     */
    getAroundRadius(x, y, radius) {
        return getAroundRadius(x, y, this.width, this.height, radius);
    }
    /**
     * Executes the callback for each cell within a given radius.
     */
    foreachAroundRadius(x, y, radius, callback, stopOnTrue = false) {
        const neighbors = this.getAroundRadius(x, y, radius);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                break;
            }
        }
        return this;
    }
    /**
     * Returns a deep copy of the underlying 2D array.
     */
    toArray() {
        return this.__values.map((row) => row.slice());
    }
    /**
     * Returns a random element from the matrix in the format [x, y, value].
     */
    getRandomElement() {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        return [x, y, this.__values[x][y]];
    }
}
