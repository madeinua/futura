import { create2DArray, getRectangleAround, getAroundRadius } from "../helpers.js";
/**
 * Generate 2D matrix from the array
 */
export default class Matrix {
    constructor(width, height, defaultValue) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(this.width, this.height, defaultValue !== null && defaultValue !== void 0 ? defaultValue : null);
    }
    /**
     * Get all cells of matrix
     */
    getValues() {
        return this.__values;
    }
    /**
     * Retrieve all cells' values of the matrix as a list
     */
    getValuesList() {
        const values = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                values.push(this.__values[x][y]);
            }
        }
        return values;
    }
    /**
     * Set all cells of matrix to the specified value
     * @param value
     */
    set(value) {
        this.foreach((x, y) => this.setCell(x, y, value));
        return this;
    }
    /**
     * Set cell value
     */
    setCell(x, y, value) {
        this.__values[x][y] = value;
        return this;
    }
    /**
     * Retrieve cell value
     */
    getCell(x, y) {
        return this.__values[x][y];
    }
    /**
     * Get matrix width
     */
    getWidth() {
        return this.width;
    }
    /**
     * Get matrix height
     */
    getHeight() {
        return this.height;
    }
    /**
     * Convert Matrix to list
     */
    toList() {
        const arr = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr.push(this.getCell(x, y));
            }
        }
        return arr;
    }
    /**
     * Applies the callback to the elements of the Matrix and accepts return value as the Matrix cell value
     */
    map(value) {
        const isFunc = typeof value === 'function';
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.setCell(x, y, isFunc ? value(x, y) : value);
            }
        }
        return this;
    }
    /**
     * Applies the callback to the elements of the Matrix
     */
    foreach(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }
    /**
     * Applies the callback to the elements of the Matrix
     */
    foreachValues(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(this.getCell(x, y), x, y);
            }
        }
    }
    /**
     * Applies the callback to the elements of the Matrix but only to the filled cells
     */
    foreachFilledValues(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const v = this.getCell(x, y);
                if (v !== null) {
                    callback(v, x, y);
                }
            }
        }
    }
    /**
     * Set all cells of matrix
     */
    setAll(values) {
        this.__values = values;
        return this;
    }
    unsetAll() {
        this.__values = create2DArray(this.width, this.height, null);
        return this;
    }
    /**
     * Retrieve cell neighbors around the cell
     */
    getNeighbors(x, y) {
        return getRectangleAround(x, y, this.width, this.height);
    }
    /**
     * Apply callback to all neighbors
     */
    foreachNeighbors(x, y, callback, stopOnTrue = false) {
        const neighbors = this.getNeighbors(x, y);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                return this;
            }
        }
        return this;
    }
    /**
     * Retrieve cells around a specified cell in a specified radius
     */
    getAroundRadius(x, y, radius) {
        return getAroundRadius(x, y, this.width, this.height, radius);
    }
    /**
     * Apply callback to all neighbors
     */
    foreachAroundRadius(x, y, radius, callback, stopOnTrue = false) {
        const neighbors = this.getAroundRadius(x, y, radius);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                return this;
            }
        }
        return this;
    }
    /**
     * Convert Matrix to array
     */
    toArray() {
        return this.__values.map(row => [...row]);
    }
    /**
     * Get a random element from the matrix
     */
    getRandomElement() {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        return [x, y, this.getCell(x, y)];
    }
}
