import {CellsList, getAroundRadius, getRectangleAround} from "./Cells.js";
import {Array2D, create2DArray} from "./Array2D.js";

/**
 * Matrix<T>
 * A generic 2D matrix wrapper.
 */
export default class Matrix<T = any> {
    readonly width: number;
    readonly height: number;
    protected __values: Array2D<T>;

    constructor(width: number, height: number, defaultValue?: T) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(width, height, defaultValue ?? null);
    }

    /**
     * Returns the underlying 2D array.
     */
    getValues(): T[][] {
        return this.__values;
    }

    /**
     * Returns all cell values as a flat array.
     */
    getValuesList(): T[] {
        const total = this.width * this.height;
        const values: T[] = new Array(total);
        let index = 0;
        const {width, height, __values} = this;

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
    set(value: T): this {
        const {width, height, __values} = this;

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
    setCell(x: number, y: number, value: T): this {
        this.__values[x][y] = value;
        return this;
    }

    /**
     * Retrieves a cell value.
     */
    getCell(x: number, y: number): T {
        return this.__values[x][y];
    }

    /**
     * Returns the matrix width.
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Returns the matrix height.
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Applies the callback to each cell and stores the result.
     * If a non‑function value is provided, that value is used to set every cell.
     */
    map(callbackOrValue: T | ((x: number, y: number) => T)): this {
        const isFunc = typeof callbackOrValue === "function";
        const {width, height, __values} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                __values[x][y] = isFunc
                    ? (callbackOrValue as (x: number, y: number) => T)(x, y)
                    : callbackOrValue;
            }
        }

        return this;
    }

    /**
     * Executes the callback for each cell.
     */
    foreach(callback: (x: number, y: number) => void): void {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Executes the callback for each cell, passing in the cell’s value.
     */
    foreachValues(callback: (value: T, x: number, y: number) => void): void {
        const {width, height, __values} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(__values[x][y], x, y);
            }
        }
    }

    /**
     * Executes the callback for each non-null cell.
     */
    foreachFilledValues(callback: (value: T, x: number, y: number) => void): void {
        const {width, height, __values} = this;

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
    setAll(values: Array2D<T>): this {
        this.__values = values;

        return this;
    }

    /**
     * Resets the matrix to a new array with all cells set to null.
     */
    unsetAll(): this {
        this.__values = create2DArray(this.width, this.height, null);

        return this;
    }

    /**
     * Returns the neighbors around a cell using a rectangular pattern.
     */
    getNeighbors(x: number, y: number): CellsList {
        return getRectangleAround(x, y, this.width, this.height);
    }

    /**
     * Executes the callback for each neighbor.
     */
    foreachNeighbors(
        x: number,
        y: number,
        callback: (x: number, y: number) => boolean | void,
        stopOnTrue: boolean = false
    ): this {
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
    getAroundRadius(x: number, y: number, radius: number): CellsList {
        return getAroundRadius(x, y, this.width, this.height, radius);
    }

    /**
     * Executes the callback for each cell within a given radius.
     */
    foreachAroundRadius(
        x: number,
        y: number,
        radius: number,
        callback: (x: number, y: number) => boolean | void,
        stopOnTrue: boolean = false
    ): this {
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
    toArray(): Array2D<T> {
        return this.__values.map((row) => row.slice());
    }

    /**
     * Returns a random element from the matrix in the format [x, y, value].
     */
    getRandomElement(): [number, number, T] {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);

        return [x, y, this.__values[x][y]];
    }
}