import {Array2D} from "./Array2D";

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

    previous(): T[] | undefined {
        return this.items.length > 1 ? this.items[this.items.length - 2] : undefined;
    }

    get(i: number): T[] | undefined {
        return i < this.items.length ? this.items[i] : undefined;
    }

    get length(): number {
        return this.items.length;
    }

    includes(item: T[]): boolean {
        // Note: This uses strict equality.
        return this.items.includes(item);
    }

    foreach(callback: (item: T[]) => void): void {
        for (let i = 0, len = this.items.length; i < len; i++) {
            callback(this.items[i]);
        }
    }

    foreachCell(callback: (x: T, y: T) => void): void {
        for (let i = 0, len = this.items.length; i < len; i++) {
            const item = this.items[i];
            // Check that item has at least two elements
            if (item.length >= 2) {
                callback(item[0], item[1]);
            }
        }
    }
}