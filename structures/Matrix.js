/**
 * Generate 2D matrix from the array
 * @param {number} width
 * @param {number} height
 * @constructor
 */
class Matrix {

    /** @var {number} */
    width;

    /** @var {number} */
    height;

    /** @var {Array} */
    __values;

    /**
     * Constructor
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = typeof width === 'undefined' ? config.WORLD_SIZE : width;
        this.height = typeof height === 'undefined' ? config.WORLD_SIZE : height;
        this.__values = create2DArray(this.width, this.height, null);
    }

    /**
     * Get all tiles of matrix
     * @return {Array}
     */
    getValues() {
        return this.__values;
    }

    /**
     * Retrieve all tiles of the matrix as a list
     * @return {Array}
     */
    getList() {

        let values = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                values.push(
                    this.__values[x][y]
                );
            }
        }

        return values;
    }

    /**
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {*} value
     * @return {this}
     */
    setTile(x, y, value) {

        this.__values[x][y] = value;

        return this;
    };

    /**
     * Retrieve tile value
     * @param x
     * @param y
     * @return {*}
     */
    getTile(x, y) {
        return this.__values[x][y];
    }

    /**
     * Get matrix width
     * @return {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get matrix height
     * @return {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * Convert Matrix to list
     * @return {Array}
     */
    toList() {

        let arr = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr.push(
                    this.getTile(x, y)
                );
            }
        }

        return arr;
    }

    /**
     * Applies the callback to the elements of the Matrix and accepts return value as the Matrix tile value
     * @param {*|function} value
     * @return {this}
     */
    map(value) {

        let isFunc = typeof value === 'function';

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.setTile(x, y, isFunc ? value(x, y) : value);
            }
        }

        return this;
    }

    /**
     * Applies the callback to the elements of the Matrix
     * @param {function} callback
     */
    foreach(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Set all tiles of matrix
     * @param {boolean|number|Array} values
     * @return {this}
     */
    setAll(values) {

        if (values instanceof Array) {
            this.__values = values;
        } else {
            this.map(function() {
                return values;
            });
        }

        return this;
    }

    /**
     * Convert Matrix to array
     * @return {Array}
     */
    toArray() {

        let arr = create2DArray(this.width, this.height, null);

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                arr[x][y] = this.getTile(x, y);
            }
        }

        return arr;
    }

    /**
     * Retrieve tile neighbors around the tile
     *
     * @param {number} x
     * @param {number} y
     * @return {Array}
     */
    getNeighbors(x, y) {
        return getRectangleAround(x, y, this.getWidth(), this.getHeight());
    }

    /**
     * Apply callback to all neighbors
     * @param {number} x
     * @param {number} y
     * @param {function} callback
     * @param {boolean} stopOnTrue
     * @return {this}
     */
    foreachNeighbors(x, y, callback, stopOnTrue = false) {

        let neighbors = this.getNeighbors(x, y);

        for (let i = 0; i < neighbors.length; i++) {
            if (callback(neighbors[i][0], neighbors[i][1]) && stopOnTrue) {
                return this;
            }
        }

        return this;
    }

    /**
     * Retrieve tiles around a specified tile in a specified radius
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {Array}
     */
    getAroundRadius(x, y, radius) {
        return getAroundRadius(x, y, this.getWidth(), this.getHeight(), radius);
    }

    /**
     * Apply callback to all neighbors
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {function} callback
     * @param {boolean} stopOnTrue
     * @return {this}
     */
    foreachAroundRadius(x, y, radius, callback, stopOnTrue = false) {

        let neighbors = this.getAroundRadius(x, y, radius);

        for (let i = 0; i < neighbors.length; i++) {
            if (callback(neighbors[i][0], neighbors[i][1]) && stopOnTrue) {
                return this;
            }
        }

        return this;
    }

    /**
     * @return {Array}
     */
    getRandomTile() {

        let x = Math.floor(Math.random() * this.width),
            y = Math.floor(Math.random() * this.height);

        return [x, y, this.getTile(x, y)];
    }
}