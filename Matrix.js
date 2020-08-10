/**
 * Generate 2D matrix from the array
 * @param {number} width
 * @param {number} height
 * @constructor
 */
class Matrix {

    /**
     * Constructor
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.__values = create2DArray(width, height, null);
    }

    /**
     * Get all tiles of matrix
     * @return {Array}
     */
    getAll() {
        return this.__values;
    }

    /**
     * Retrieve all values of the matrix
     * @return {Array}
     */
    values() {

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
     * @return {Matrix}
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
     * @return {Matrix}
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
     * @return {Matrix}
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
     * Retrieve tile neighbors
     * deep:
     * 1/3/5/.. exclude corners
     * 2/4/6/.. include corners
     *
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @return {Array}
     */
    getNeighbors(x, y, deep) {

        if (deep === 0) {
            return [];
        }

        let _this = this,
            _getNeighbors = function(x1, y1, deep1) {

                let points;

                if (deep1 % 2 === 0) {
                    points = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1]
                    ];
                } else {
                    points = [
                        [-1, 0],
                        [0, -1], [0, 1],
                        [1, 0]
                    ];
                }

                let w = _this.getWidth(),
                    h = _this.getHeight(),
                    neighbors = [];

                for (let i = 0; i < points.length; i++) {

                    let nx = x1 + points[i][0];
                    let ny = y1 + points[i][1];

                    if (
                        nx >= 0
                        && nx < w
                        && ny >= 0
                        && ny < h
                        && !(nx === x && ny === y)
                    ) {
                        neighbors.push([nx, ny]);
                    }
                }

                if (deep1 > 2) {

                    let len = neighbors.length;

                    for (let j = 0; j < len; j++) {
                        neighbors = neighbors.concat(
                            _getNeighbors(neighbors[j][0], neighbors[j][1], deep1 - 2)
                        );
                    }
                }

                return neighbors.unique();
            };

        return _getNeighbors(x, y, deep);
    }

    /**
     * Apply callback to all neighbors
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @param {function} callback
     * @return {Matrix}
     */
    foreachNeighbors(x, y, deep, callback) {

        let neighbors = this.getNeighbors(x, y, deep);

        for (let i = 0; i < neighbors.length; i++) {
            callback(neighbors[i][0], neighbors[i][1]);
        }

        return this;
    }
}