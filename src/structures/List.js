export default class List {
    constructor(items = []) {
        this.items = items;
    }
    push(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
    first() {
        return this.items[0];
    }
    last() {
        return this.items[this.items.length - 1];
    }
    previous() {
        return this.items.length > 1 ? [this.items.length - 2] : false;
    }
    get(i) {
        return this.items.length >= i ? false : this.items[i];
    }
    length() {
        return this.items.length;
    }
    includes(item) {
        return this.items.includes(item);
    }
    foreach(callable) {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i]);
        }
    }
    foreachCell(callable) {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i][0], this.items[i][1]);
        }
    }
}
