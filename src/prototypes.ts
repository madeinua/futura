import {Array2D} from "./structures/Array2D.js";
import {Cell} from "./structures/Cells.js";

export {};

declare global {
    interface Array<T> {
        randomElement(): T | undefined;

        removeElementByIndex(index: number): Array<T>;

        removeElementByValue(value: T): Array<T>;

        shuffle(): Array<T>;

        intersect(array: Array<T>): Array<T>;

        difference(array: Array<T>): Array<T>;

        diff(array: Array<T>): Array<T>;

        includesCell(cell: T): boolean;

        intersectCells(array: Array<T>): Array<T>;

        diffCells(array: Array<T>): Array<T>;

        unique(): Array<T>;

        getClosestDistanceToCell(cell: T): number;

        getClosestDistanceTo(x: number, y: number): number;
    }
}

/**
 * Retrieve random element of array
 */
Array.prototype.randomElement = function (): Array2D {
    return this[Math.floor(Math.random() * this.length)];
}

/**
 * Remove/delete an element from the array by the index
 */
Array.prototype.removeElementByIndex = function (index: number | string): Array2D {
    return this.filter((e, i) => i !== index);
}

/**
 * Remove/delete an element from the array by the value
 */
Array.prototype.removeElementByValue = function (value: number | string): Array2D {
    return this.filter((e) => e !== value);
}

/**
 * Shuffles array
 */
Array.prototype.shuffle = function (): Array2D {
    let j: number,
        x: number;

    for (let i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
}

Array.prototype.intersect = function (array: Array2D): Array2D {
    return this.filter(value => array.includes(value));
}

Array.prototype.diff = function (array: Array2D): Array2D {
    return this.filter(value => !array.includes(value));
}

Array.prototype.includesCell = function (xy: Cell): boolean {
    return this.some(e => ((e[0] === xy[0]) && (e[1] === xy[1])));
}

Array.prototype.intersectCells = function (array: Cell): Cell {
    return this.filter(value => array.includesCell(value));
}

Array.prototype.diffCells = function (array: Cell): Cell {
    return this.filter(value => !array.includesCell(value));
}

/**
 * Retrieve array of unique values
 */
Array.prototype.unique = function (): any {

    const a = this.concat(),
        isArray = a.length > 0 && a[0] instanceof Array;

    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (
                isArray
                    ? a[i][0] === a[j][0] && a[i][1] === a[j][1]
                    : a[i] === a[j]
            ) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
}

/**
 * Retrieve the closest distance to the cell
 */
Array.prototype.getClosestDistanceTo = function (x: number, y: number): number {

    let closeness: number = Number.MAX_SAFE_INTEGER;

    const distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    };

    for (let i = 0; i < this.length; i++) {
        closeness = Math.min(
            closeness,
            distance(x, y, this[i][0], this[i][1])
        );
    }

    return closeness;
}