class BinaryMatrix extends NumericMatrix {

    /**
     * Constructor
     * @param {number} fill
     * @param {number} width
     * @param {number} height
     */
    constructor(fill, width, height) {
        super(width, height);

        fill = typeof fill === 'undefined' ? 0 : fill;
        this.map(fill);
    }

    /**
     * @returns {this}
     */
    clone() {

        let matrix = new BinaryMatrix(0, this.width, this.height);

        matrix.__values = JSON.parse(JSON.stringify(this.__values));

        return matrix;
    }

    /**
     * Retrieve all tiles that are filled
     * @return {Array}
     */
    getFilledTiles() {

        let arr = [];

        this.foreachFilled(function(x, y) {
            arr.push([x, y]);
        });

        return arr;
    }

    /**
     * Fill the tile with the value
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    fill(x, y) {
        this.setTile(x, y, 1);
        return this;
    }

    /**
     * Remove filling the tile with the value
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    unfill(x, y) {
        this.setTile(x, y, 0);
        return this;
    }

    /**
     * Count the number of filled tiles
     * @returns {number}
     */
    count() {
        return this.__values.reduce(
            (r, a) => r + a.reduce((pv, cv) => pv + cv, 0), 0
        );
    }

    /**
     * Check if matrix has filled tiles
     * @returns {boolean}
     */
    hasFilled() {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.filled(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if the tile is filled
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    filled(x, y) {
        return this.getTile(x, y) === 1;
    }

    /**
     * Applies the callback to the filled elements of the Matrix
     * @param {function} callback
     */
    foreachFilled(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    /**
     * Applies the callback to the unfilled elements of the Matrix
     * @param {function} callback
     */
    foreachUnfilled(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    /**
     * Get closest distance to the specified coordinates
     * @param {number} x
     * @param {number} y
     * @param {number} max Maximum possible value. Bigger = slower performance!
     * @return {number}
     */
    distanceTo(x, y, max) {

        let result = Number.MAX_SAFE_INTEGER,
            minX = Math.max(0, x - max),
            maxX = Math.min(this.width - 1, x + max),
            minY = Math.max(0, y - max),
            maxY = Math.min(this.height - 1, y + max);

        for (let nx = minX; nx <= maxX; nx++) {
            for (let ny = minY; ny <= maxY; ny++) {
                if (this.filled(nx, ny)) {
                    result = Math.min(result, distance(nx, ny, x, y));
                }
            }
        }

        return result;
    }

    /**
     * Whether is any filled point around the specified coordinates
     * @param {number} x
     * @param {number} y
     * @param max Maximum possible value. Bigger = slower performance!
     * @return {boolean}
     */
    aroundFilled(x, y, max) {
        return max >= this.distanceTo(x, y, max);
    }

    /**
     * Apply binary "OR" between two binary matrix
     * @param {BinaryMatrix} matrix
     * @return {this}
     */
    combineWith(matrix) {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.__values[x][y] |= matrix.__values[x][y];
            }
        }

        return this;
    }

    /**
     * Unfill tiles which are filled in the specified matrix
     * @param {BinaryMatrix} matrix
     * @returns {BinaryMatrix}
     */
    diff(matrix) {

        let _this = this;

        matrix.foreachFilled(function(x, y) {
            _this.unfill(x, y);
        });

        return _this;
    }

    /**
     * Unfill tiles which are filled in the specified array of tiles
     * @param {Array} tiles
     * @returns {BinaryMatrix}
     */
    diffTiles(tiles) {

        for (let i = 0; i < tiles.length; i++) {
            if (this.filled(tiles[i][0], tiles[i][1])) {
                this.unfill(tiles[i][0], tiles[i][1]);
            }
        }

        return this;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Array}
     */
    getFilledNeighbors(x, y) {

        let result = [],
            _this = this;

        _this.foreachNeighbors(x, y, function(nx, ny) {
            if (_this.filled(nx, ny)) {
                result.push([nx, ny]);
            }
        });

        return result;
    }

    /**
     * Retrieve size of the array compared to the total number size of the map
     * @return {number}
     */
    getSize() {
        return round(this.getFilledTiles().length / (this.width * this.height), 2) * 100;
    }

    /**
     * @param {number} startX
     * @param {number} startY
     * @return {number}
     */
    getSizeFromPoint = function(startX, startY) {

        if (!this.filled(startX, startY)) {
            return 0;
        }

        let sx,
            sy,
            coords = [];

        for (let d = 0; d < 4; d++) {

            sx = startX;
            sy = startY;

            while(true) {

                if (d === 0) {
                    sx++;
                } else if (d === 1) {
                    sy++;
                } else if (d === 2) {
                    sx--;
                } else if (d === 3) {
                    sy--;
                }

                if (!this.filled(sx, sy)) {
                    coords.push([sx, sy]);
                    break;
                }
            }
        }

        return Math.abs(
            getPolygonAreaSize(coords)
        );
    };
}