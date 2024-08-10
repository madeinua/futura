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

Array.prototype.randomElement = function <T>(): T | undefined {
    return this.length ? this[Math.floor(Math.random() * this.length)] : undefined;
}

Array.prototype.removeElementByIndex = function <T>(index: number): Array<T> {
    return this.filter((_, i) => i !== index);
}

Array.prototype.removeElementByValue = function <T>(value: T): Array<T> {
    return this.filter(e => e !== value);
}

Array.prototype.shuffle = function <T>(): Array<T> {
    const arrayCopy = [...this];
    let j: number, x: T;
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = x;
    }
    return arrayCopy;
}

Array.prototype.intersect = function <T>(array: Array<T>): Array<T> {
    return this.filter(value => array.includes(value));
}

Array.prototype.diff = function <T>(array: Array<T>): Array<T> {
    return this.filter(value => !array.includes(value));
}

Array.prototype.includesCell = function (cell: Cell): boolean {
    return this.some(([x, y]: Cell) => x === cell[0] && y === cell[1]);
}

Array.prototype.intersectCells = function (array: Array<Cell>): Array<Cell> {
    return this.filter(cell => array.includesCell(cell));
}

Array.prototype.diffCells = function (array: Array<Cell>): Array<Cell> {
    return this.filter(cell => !array.includesCell(cell));
}

Array.prototype.unique = function <T>(): Array<T> {
    return this.filter((value, index, self) =>
            index === self.findIndex((t) => (
                Array.isArray(value) && Array.isArray(t)
                    ? value.length === t.length && value.every((val, i) => val === t[i])
                    : t === value
            ))
    );
}

Array.prototype.getClosestDistanceTo = function (x: number, y: number): number {
    let closestDistance = Number.MAX_SAFE_INTEGER;

    const distance = (x1: number, y1: number, x2: number, y2: number): number =>
        Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    this.forEach(([cx, cy]: Cell) => {
        closestDistance = Math.min(closestDistance, distance(x, y, cx, cy));
    });

    return closestDistance;
}