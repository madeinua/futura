import {create2DArray, getRectangleAround, getAroundRadius} from "../helpers.js";
import {CellsList} from "./Cells.js";
import {Array2D} from "./Array2D.js";

/**
 * Generate 2D matrix from the array
 */
export default class Matrix<T = any> {

    readonly width: number;
    readonly height: number;
    protected __values: Array2D<T>;

    constructor(width: number, height: number, defaultValue?: T) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(this.width, this.height, defaultValue ?? null);
    }

    /**
     * Get all cells of matrix
     */
    getValues(): T[][] {
        return this.__values;
    }

    /**
     * Retrieve all cells' values of the matrix as a list
     */
    getValuesList(): T[] {
        const values: T[] = [];

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
    set(value: T): this {
        this.foreach((x, y) => this.setCell(x, y, value));
        return this;
    }

    /**
     * Set cell value
     */
    setCell(x: number, y: number, value: T): this {
        this.__values[x][y] = value;
        return this;
    }

    /**
     * Retrieve cell value
     */
    getCell(x: number, y: number): T {
        return this.__values[x][y];
    }

    /**
     * Get matrix width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get matrix height
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Convert Matrix to list
     */
    toList(): T[] {
        const arr: T[] = [];
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
    map(value: T | Function): this {
        const isFunc = typeof value === 'function';

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.setCell(
                    x, y,
                    isFunc ? (value as Function)(x, y) : value
                );
            }
        }

        return this;
    }

    /**
     * Applies the callback to the elements of the Matrix
     */
    foreach(callback: (x: number, y: number) => void): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Applies the callback to the elements of the Matrix
     */
    foreachValues(callback: (value: T, x: number, y: number) => void): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(this.getCell(x, y), x, y);
            }
        }
    }

    /**
     * Applies the callback to the elements of the Matrix but only to the filled cells
     */
    foreachFilledValues(callback: (value: T, x: number, y: number) => void): void {
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
    setAll(values: Array2D<T>): this {
        this.__values = values;
        return this;
    }

    unsetAll(): this {
        this.__values = create2DArray(this.width, this.height, null);
        return this;
    }

    /**
     * Retrieve cell neighbors around the cell
     */
    getNeighbors(x: number, y: number): CellsList {
        return getRectangleAround(x, y, this.width, this.height);
    }

    /**
     * Apply callback to all neighbors
     */
    foreachNeighbors(x: number, y: number, callback: (x: number, y: number) => boolean | void, stopOnTrue: boolean = false): this {
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
    getAroundRadius(x: number, y: number, radius: number): CellsList {
        return getAroundRadius(x, y, this.width, this.height, radius);
    }

    /**
     * Apply callback to all neighbors
     */
    foreachAroundRadius(x: number, y: number, radius: number, callback: (x: number, y: number) => boolean | void, stopOnTrue: boolean = false): this {
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
    toArray(): Array2D<T> {
        return this.__values.map(row => [...row]) as Array2D<T>;
    }

    /**
     * Get a random element from the matrix
     */
    getRandomElement(): [number, number, T] {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        return [x, y, this.getCell(x, y)];
    }
}