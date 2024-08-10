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
        return this.items.length > 1 ? this.items[this.items.length - 2] : false;
    }
    get(i) {
        return i < this.items.length ? this.items[i] : false;
    }
    get length() {
        return this.items.length;
    }
    includes(item) {
        return this.items.includes(item);
    }
    foreach(callable) {
        for (const item of this.items) {
            callable(item);
        }
    }
    foreachCell(callable) {
        for (const item of this.items) {
            if (item.length >= 2) {
                callable(item[0], item[1]);
            }
        }
    }
}
