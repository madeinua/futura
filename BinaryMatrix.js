class BinaryMatrix extends NumericMatrix {

    /**
     * Constructor
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        super(width, height);
        this.map(false);
    }

    /**
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {boolean} value
     * @return {BinaryMatrix}
     */
    setTile(x, y, value) {

        this.__values[x][y] = value >= 0.5 ? 1 : 0;

        return this;
    };

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
     * @return {BinaryMatrix}
     */
    fill(x, y) {
        this.setTile(x, y, 1);
        return this;
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
     * @param x
     * @param y
     * @param max Maximum possible value. Bigger = slower performance!
     * @return {boolean}
     */
    aroundFilled(x, y, max) {
        return max >= this.distanceTo(x, y, max);
    }

    /**
     * Apply binary "OR" between two binary matrix
     * @param {BinaryMatrix} matrix
     */
    combineWith(matrix) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.__values[x][y] |= matrix.__values[x][y];
            }
        }
    }

    /**
     * Retrieve all neighbors to the binary matrix
     * @param {number} deep
     * @return {BinaryMatrix}
     */
    getAllNeighbors(deep) {

        let map = new BinaryMatrix(this.getWidth(), this.getHeight());

        this.foreachFilled(function(x, y) {
            let neighbors = map.getNeighbors(x, y, deep);
            for (let i = 0; i < neighbors.length; i++) {
                map.fill(neighbors[i][0], neighbors[i][1]);
            }
        });

        return map;
    }

    /**
     * Apply callback to all neighbors of all
     * @param deep
     * @param callback
     * @return {BinaryMatrix}
     */
    foreachAllFilledNeighbors(deep, callback) {

        let _this = this;

        _this.foreachFilled(function(x, y) {
            _this.foreachNeighbors(x, y, deep, function(nx, ny) {
                callback(nx, ny);
            });
        });

        return _this;
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