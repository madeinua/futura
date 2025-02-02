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
        return this.items.length > 1 ? this.items[this.items.length - 2] : undefined;
    }
    get(i) {
        return i < this.items.length ? this.items[i] : undefined;
    }
    get length() {
        return this.items.length;
    }
    includes(item) {
        // Note: This uses strict equality.
        return this.items.includes(item);
    }
    foreach(callback) {
        for (let i = 0, len = this.items.length; i < len; i++) {
            callback(this.items[i]);
        }
    }
    foreachCell(callback) {
        for (let i = 0, len = this.items.length; i < len; i++) {
            const item = this.items[i];
            // Check that item has at least two elements
            if (item.length >= 2) {
                callback(item[0], item[1]);
            }
        }
    }
}
