import {Array2D} from "./Array2D.js";

export default class List<T> {
    protected items: Array2D<T>;

    constructor(items: Array2D<T> = []) {
        this.items = items;
    }

    push(item: T[]): void {
        this.items.push(item);
    }

    getAll(): Array2D<T> {
        return this.items;
    }

    first(): T[] | undefined {
        return this.items[0];
    }

    last(): T[] | undefined {
        return this.items[this.items.length - 1];
    }

    previous(): T[] | false {
        return this.items.length > 1 ? this.items[this.items.length - 2] : false;
    }

    get(i: number): T[] | false {
        return i < this.items.length ? this.items[i] : false;
    }

    get length(): number {
        return this.items.length;
    }

    includes(item: T[]): boolean {
        return this.items.includes(item);
    }

    foreach(callable: (item: T[]) => void): void {
        for (const item of this.items) {
            callable(item);
        }
    }

    foreachCell(callable: (x: T, y: T) => void): void {
        for (const item of this.items) {
            if (item.length >= 2) {
                callable(item[0], item[1]);
            }
        }
    }
}