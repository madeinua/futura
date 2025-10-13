import {Cell} from "./structures/Cells";

export {};

declare global {
    interface Array<T> {
        randomElement(): T | undefined;

        removeElementByIndex(index: number): Array<T>;

        removeElementByValue(value: T): Array<T>;

        shuffle(): Array<T>;

        intersect(array: Array<T>): Array<T>;

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
};

Array.prototype.removeElementByIndex = function <T>(index: number): Array<T> {
    return this.filter((_, i) => i !== index);
};

Array.prototype.removeElementByValue = function <T>(value: T): Array<T> {
    return this.filter(e => e !== value);
};

Array.prototype.shuffle = function <T>(): Array<T> {
    const arrayCopy = [...this];
    let j: number, temp: T;
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = temp;
    }
    return arrayCopy;
};

Array.prototype.intersect = function <T>(array: Array<T>): Array<T> {
    return this.filter((value: T) => array.includes(value));
};

Array.prototype.diff = function <T>(array: Array<T>): Array<T> {
    return this.filter((value: T) => !array.includes(value));
};

Array.prototype.includesCell = function (cell: Cell): boolean {
    return this.some(([x, y]: Cell) => x === cell[0] && y === cell[1]);
};

Array.prototype.intersectCells = function (array: Array<Cell>): Array<Cell> {
    return this.filter((cell: Cell) => array.includesCell(cell));
};

Array.prototype.diffCells = function (array: Array<Cell>): Array<Cell> {
    return this.filter((cell: Cell) => !array.includesCell(cell));
};

Array.prototype.unique = function <T>(): Array<T> {
    return this.filter((value, index, self) =>
            index === self.findIndex((t) =>
                Array.isArray(value) && Array.isArray(t)
                    ? value.length === t.length && value.every((val, i) => val === t[i])
                    : t === value
            )
    );
};

Array.prototype.getClosestDistanceTo = function (x: number, y: number): number {
    let minSq = Number.MAX_SAFE_INTEGER;

    // Using squared distance to avoid unnecessary sqrt calls in the loop.
    this.forEach(([cx, cy]: Cell) => {
        const dx = x - cx, dy = y - cy;
        const dSq = dx * dx + dy * dy;
        if (dSq < minSq) {
            minSq = dSq;
        }
    });

    return Math.sqrt(minSq);
};

Array.prototype.getClosestDistanceToCell = function (cell: Cell): number {
    // Delegates to getClosestDistanceTo using the cell's coordinates.
    return this.getClosestDistanceTo(cell[0], cell[1]);
};