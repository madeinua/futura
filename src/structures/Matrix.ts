import {create2DArray, getRectangleAround, getAroundRadius} from "../helpers.js";
import {CellsList} from "./Cells.js";
import {Array2D} from "./Array2D.js";

/**
 * Generate 2D matrix from the array
 */
export default class Matrix<T extends Array2D = Array2D> {

    width: number;
    height: number;
    __values: T;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(this.width, this.height, null) as T;
    }

    /**
     * Get all cells of matrix
     */
    getValues(): T {
        return this.__values;
    }

    /**
     * Retrieve all cells' values of the matrix as a list
     */
    getValuesList(): Array<number> {
        const values = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                values.push(
                    this.__values[x][y]
                );
            }
        }

        return values;
    }

    /**
     * Set cell value
     */
    setCell(x: number, y: number, value: any): any {
        this.__values[x][y] = value;

        return this;
    }

    /**
     * Retrieve cell value
     */
    getCell(x: number, y: number): T[number][number] {
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
    toList(): CellsList {
        const arr = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr.push(
                    this.getCell(x, y)
                );
            }
        }

        return arr;
    }

    /**
     * Applies the callback to the elements of the Matrix and accepts return value as the Matrix cell value
     */
    map(value: any): any {
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
    foreach(callback: Function): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Set all cells of matrix
     */
    setAll(values: T): any {

        if (values instanceof Array) {
            this.__values = values;
        } else {
            this.map(function (): any {
                return values;
            });
        }

        return this;
    }

    /**
     * Retrieve cell neighbors around the cell
     */
    getNeighbors(x: number, y: number): CellsList {
        return getRectangleAround(x, y, this.getWidth(), this.getHeight());
    }

    /**
     * Apply callback to all neighbors
     */
    foreachNeighbors(x: number, y: number, callback: Function, stopOnTrue: boolean = false): any {
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
    getAroundRadius(x: number, y: number, radius: number): CellsList {
        return getAroundRadius(x, y, this.getWidth(), this.getHeight(), radius);
    }

    /**
     * Apply callback to all neighbors
     */
    foreachAroundRadius(x: number, y: number, radius: number, callback: Function, stopOnTrue: boolean = false): any {
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
    toArray(): Array2D {

        const arr = create2DArray(this.width, this.height, null);

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr[x][y] = this.getCell(x, y);
            }
        }

        return arr;
    }

    getRandomElement(): [number, number, number] {

        const x = Math.floor(Math.random() * this.width),
            y = Math.floor(Math.random() * this.height);

        return [x, y, this.getCell(x, y)];
    }
}