/**
 * Generate matrix of cells
 * @param {number} width
 * @param {number} height
 * @constructor
 */
class NumericMatrix extends Matrix {

    /**
     * @return {string}
     */
    toString = function() {
        return JSON.stringify(
            this.__values
        );
    };

    /**
     * @param {string} string
     */
    fromString = function(string) {
        this.setAll(
            JSON.parse(string)
        );
    };

    /**
     * Add value to a current cell value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {this}
     */
    addToCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) + value);
    }

    /**
     * Subtract value from a current cell value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {this}
     */
    subtractFromCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) - value);
    }

    /**
     * Compare current matrix to the other one
     * @param {NumericMatrix} matrix
     * @return {boolean}
     */
    equals(matrix) {
        return this.__values.toString() === matrix.__values.toString();
    }

    /**
     * Get matrix greyscale level
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    getGrayscale(x, y) {
        return fromFraction(this.getCell(x, y), 0, 255);
    }

    /**
     * Count sum of all neighbors
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    sumNeighbors(x, y) {

        let sum = 0,
            _this = this;

        _this.foreachNeighbors(x, y, function(nx, ny) {
            sum += _this.getCell(nx, ny);
        });

        return sum;
    }

    /**
     * Add value to all neighbors of the point [x, y]
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {this}
     */
    addToNeighborCells(x, y, value) {

        let _this = this;

        _this.foreachNeighbors(x, y, function(nx, ny) {
            _this.addToCell(nx, ny, value);
        });

        return _this;
    }

    /**
     * Check if Matrix has at least one element with a specified value
     * @param {number} value
     * @return {boolean}
     */
    has(value) {

        let found = false,
            _this = this;

        _this.foreach(function(x, y) {
            if (_this.getCell(x, y) === value) {
                found = true;
            }
        });

        return found;
    }

    /**
     * Scale matrix to fit min/max ranges
     * @param {number} min
     * @param {number} max
     * @return {this}
     */
    setRange(min, max) {

        let _this = this,
            values = _this.getList(),
            currMin = Math.min(...values),
            currMax = Math.max(...values);

        _this.map(function(x, y) {
            return changeRange(
                _this.getCell(x, y),
                currMin,
                currMax,
                min,
                max
            );
        });

        return _this;
    }

    /**
     * Retrieve minimum value
     * @return {number}
     */
    getMin() {
        return round(Math.min.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve maximum value
     * @return {number}
     */
    getMax() {
        return round(Math.max.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve average value
     * @return {number}
     */
    getAvgValue() {
        return round(this.getList().reduce((a, b) => a + b, 0) / (this.width * this.height), 2);
    }
}