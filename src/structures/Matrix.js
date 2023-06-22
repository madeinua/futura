import { create2DArray, getRectangleAround, getAroundRadius } from "../helpers.js";
/**
 * Generate 2D matrix from the array
 */
export default class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(this.width, this.height, null);
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
     * Set all cells of matrix
     */
    setAll(values) {
        if (values instanceof Array) {
            this.__values = values;
        }
        else {
            this.map(function () {
                return values;
            });
        }
        return this;
    }
    /**
     * Retrieve cell neighbors around the cell
     */
    getNeighbors(x, y) {
        return getRectangleAround(x, y, this.getWidth(), this.getHeight());
    }
    /**
     * Apply callback to all neighbors
     */
    foreachNeighbors(x, y, callback, stopOnTrue = false) {
        const neighbors = this.getNeighbors(x, y);
        for (let i = 0; i < neighbors.length; i++) {
            if (callback(neighbors[i][0], neighbors[i][1]) && stopOnTrue) {
                return this;
            }
        }
        return this;
    }
    /**
     * Retrieve cells around a specified cell in a specified radius
     */
    getAroundRadius(x, y, radius) {
        return getAroundRadius(x, y, this.getWidth(), this.getHeight(), radius);
    }
    /**
     * Apply callback to all neighbors
     */
    foreachAroundRadius(x, y, radius, callback, stopOnTrue = false) {
        const neighbors = this.getAroundRadius(x, y, radius);
        for (let i = 0; i < neighbors.length; i++) {
            if (callback(neighbors[i][0], neighbors[i][1]) && stopOnTrue) {
                return this;
            }
        }
        return this;
    }
    /**
     * Convert Matrix to array
     */
    toArray() {
        const arr = create2DArray(this.width, this.height, null);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr[x][y] = this.getCell(x, y);
            }
        }
        return arr;
    }
    getRandomElement() {
        const x = Math.floor(Math.random() * this.width), y = Math.floor(Math.random() * this.height);
        return [x, y, this.getCell(x, y)];
    }
}
