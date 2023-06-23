import {Array2D} from "./Array2D";

export default class List {

    items: Array2D;

    constructor(items: Array2D = []) {
        this.items = items;
    }

    push(item: any) {
        this.items.push(item);
    }

    getAll(): Array2D {
        return this.items;
    }

    first(): any {
        return this.items[0];
    }

    last(): any {
        return this.items[this.items.length - 1];
    }

    previous(): any {
        return this.items.length > 1 ? [this.items.length - 2] : false;
    }

    get(i: number): any {
        return this.items.length >= i ? false : this.items[i];
    }

    length(): number {
        return this.items.length;
    }

    includes(item: any): boolean {
        return this.items.includes(item);
    }

    foreach(callable: Function): void {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i]);
        }
    }

    foreachCell(callable: Function): void {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i][0], this.items[i][1]);
        }
    }
}