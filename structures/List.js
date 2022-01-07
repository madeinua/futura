class List {

    items;

    /**
     * @param {Array} items
     */
    constructor(items = []) {
        this.items = items;
    }

    /**
     * @param {*} item
     */
    push(item) {
        this.items.push(item);
    }

    /**
     * @returns {Array}
     */
    getAll() {
        return this.items;
    }

    /**
     * @returns {*}
     */
    first() {
        return this.items[0];
    }

    /**
     * @returns {*}
     */
    last() {
        return this.items[this.items.length - 1];
    }

    /**
     * @returns {*}
     */
    previous() {
        return this.items.length > 1 ? [this.items.length - 2] : false;
    }

    /**
     * @param {number} i
     * @returns {*}
     */
    get(i) {
        return this.items.length >= i ? false : this.items[i];
    }

    /**
     * @returns {number}
     */
    length() {
        return this.items.length;
    }

    /**
     * @param {*} item
     * @returns {boolean}
     */
    includes(item) {
        return this.items.includes(item);
    }

    /**
     * @param {function} callable
     */
    foreach(callable) {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i]);
        }
    }

    /**
     * @param {function} callable
     */
    foreachTile(callable) {
        for (let i = 0; i < this.items.length; i++) {
            callable(this.items[i][0], this.items[i][1]);
        }
    }
}