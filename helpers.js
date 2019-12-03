let errors = 0;

/**
 * @param msg
 * @param {Number} limit
 */
function throwError(msg, limit) {
    limit = typeof limit == 'undefined' ? 1 : limit;
    if (errors < limit) {
        console.error(msg);
        errors++;
    }
}

let Filters = {

    /**
     * @private
     */
    filters: {},

    /**
     * @param {String} tag
     * @param {function} filter
     * @return {Matrix}
     */
    add: function(tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
        return this;
    },

    /**
     *
     * @param {String} tag
     * @param val
     * @return
     */
    apply: function(tag, val) {

        if (this.filters[tag]) {
            let filters = this.filters[tag];
            for(let i = 0; i < filters.length; i++) {
                val = filters[i](val);
            }
        }

        return val;
    }
};

/**
 * Retrieve random element of array
 * @return {string|number}
 */
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
};

/**
 * Shuffles array
 * @return {Array}
 */
Array.prototype.shuffle = function() {
    let j, x, i;
    for(i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
};

/**
 * Get random value between two float values
 * @param {number} float1
 * @param {number} float2
 * @return {number}
 */
function randBetweenFloats(float1, float2) {
    return normalRandom() * (float2 - float1) + float1;
}

/**
 * Create normal randomization
 * @see https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * @return {number}
 */
function normalRandom() {

    let u = 0, v = 0;

    while(u === 0) {
        u = Math.random();
    }

    while(v === 0) {
        v = Math.random();
    }

    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5;

    if (num > 1 || num < 0) {
        return normalRandom();
    }

    return num;
}

/**
 * Convert range [0-1] to another range [min-max]
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function tval(value, min, max) {
    return (value * (max - min)) + min;
}

/**
 * Convert value in between [0-1] to RGB range [0-255]
 * @param {number} value
 * @return {number}
 */
function tvalRGB(value) {
    return value * 255;
}

/**
 * Retrieve distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {number}
 */
function distance(x1, y1, x2, y2) {
    return Math.floor(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)));
}

/**
 * Retrieve array of unique values
 * @return {Array}
 */
Array.prototype.unique = function() {
    let a = this.concat();
    for(let i = 0; i < a.length; ++i) {
        for(let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};

/**
 * Retrieve closest distance to the tile
 * @param {number} x
 * @param {number} y
 * @return {boolean|number}
 */
Array.prototype.getClosestDistanceTo = function(x, y) {

    let closeness = Number.MAX_SAFE_INTEGER;

    for(let i = 0; i < this.length; i++) {
        closeness = Math.min(
            closeness,
            distance(x, y, this[i][0], this[i][1])
        );
    }

    return closeness;
};

/**
 * Check if tile is available in the array
 * @param {number} x
 * @param {number} y
 * @param {Array} arr
 * @return {boolean}
 */
function arrayHasPoint(arr, x, y) {

    for(let i = 0; i < arr.length; i++) {
        if (arr[i][0] === x && arr[i][1] === y) {
            return true;
        }
    }

    return false;
}

/**
 * Get position of the HTML Element
 * @param {HTMLElement} element
 * @return {{x: number, y: number}}
 */
function getPosition(element) {
    let rect = element.getBoundingClientRect();
    return {x: rect.left, y: rect.top};
}

/**
 * Generate matrix of tiles
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
        this.__values = [];

        for(let x = 0; x < width; x++) {
            this.__values[x] = [];
            for(let y = 0; y < height; y++) {
                this.__values[x][y] = null;
            }
        }
    }

    /**
     * Get all tiles of matrix
     * @return {Array}
     */
    getAll() {
        return this.__values;
    }

    /**
     * Set all tiles of matrix
     * @param {Array} values
     * @return {Matrix}
     */
    setAll(values) {

        this.__values = values;

        return this;
    }

    /**
     * @return {string}
     */
    toString = function() {
        return JSON.stringify(
            this.getAll()
        );
    };

    /**
     * @param {string} string
     * @return {Matrix}
     */
    fromString = function (string) {
        return this.setAll(
            JSON.parse(string)
        );
    };

    /**
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {number} value
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
     * @return {number}
     */
    getTile(x, y) {
        return this.__values[x][y];
    }

    /**
     * Add value to a current tile value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     */
    addToTile(x, y, value) {
        this.setTile(x, y, this.getTile(x, y) + value);
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
     * Convert Matrix to array
     * @return {Array}
     */
    toArray() {

        let arr = [],
            _this = this;

        _this.foreach(function(x, y) {

            if (typeof arr[x] === "undefined") {
                arr[x] = [];
            }

            arr[x][y] = _this.getTile(x, y);
        });

        return arr;
    }

    /**
     * Compare current matrix to the other one
     * @param {Matrix} matrix
     * @return {boolean}
     */
    equals(matrix) {
        return this.getAll().toString() === matrix.getAll().toString();
    }

    /**
     * Applies the callback to the elements of the Matrix and accepts return value as the Matrix tile value
     * @param {number|function} value
     * @return {Matrix}
     */
    map(value) {

        let isFunc = typeof value === 'function';

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
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
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Get matrix greyscale level
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    getGrayscale(x, y) {
        return tval(this.getTile(x, y), 0, 255);
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

        let points;

        if (deep % 2 === 0) {
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

        let w = this.getWidth(),
            h = this.getHeight(),
            neighbours = [];

        for(let i = 0; i < points.length; i++) {
            let nx = x + points[i][0];
            let ny = y + points[i][1];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                neighbours.push([nx, ny]);
            }
        }

        if (deep > 2) {
            let len = neighbours.length;
            for(let j = 0; j < len; j++) {
                neighbours = neighbours.concat(
                    this.getNeighbors(neighbours[j][0], neighbours[j][1], deep - 2)
                );
            }
        }

        return neighbours.unique();
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

        for(let i = 0; i < neighbors.length; i++) {
            callback(neighbors[i][0], neighbors[i][1]);
        }

        return this;
    }

    /**
     * Count sum of all neighbors
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @return {number}
     */
    sumNeighbors(x, y, deep) {

        let sum = 0,
            _this = this;

        _this.foreachNeighbors(x, y, deep, function(nx, ny) {
            sum += _this.getTile(nx, ny);
        });

        return sum;
    }

    /**
     * Add value to all neighbors of the point [x, y]
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @param {number} value
     * @return {Matrix}
     */
    addToNeighborTiles(x, y, deep, value) {

        let _this = this;

        this.foreachNeighbors(x, y, deep, function(nx, ny) {
            _this.addToTile(nx, ny, value);
        });

        return this;
    }

    /**
     * Check if Matrix has at least one element with a specified value
     * @param {number} value
     * @return {boolean}
     */
    has(value) {

        let found = false,
            _this = this;

        this.foreach(function(x, y) {
            if (_this.getTile(x, y) === value) {
                found = true;
            }
        });

        return found;
    }

    /**
     * Check if at least one tile around the tile has specified value
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @param {number} value
     * @return {boolean}
     */
    around(x, y, deep, value) {

        let surrounds = this.getNeighbors(x, y, deep);

        for(let i = 0; i < surrounds.length; i++) {
            if (this.getTile(surrounds[i][0], surrounds[i][1]) === value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Set min/max possible values of the matrix
     * @param {number} min
     * @param {number} max
     * @return {Matrix}
     */
    setRange(min, max) {

        let _this = this,
            val;

        this.map(function(x, y) {

            val = _this.getTile(x, y);

            if (val > max) {
                val = max;
            }

            if (min > val) {
                val = min;
            }

            return val;
        });

        return this;
    }
}

class BinaryMatrix extends Matrix {

    /**
     * Constructor
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        super(width, height);
        this.map(0);
    }

    /**
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {Matrix}
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
     * Applies the callback to the elements of the Matrix
     * @param {function} callback
     */
    foreachFilled(callback) {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if (this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    /**
     * Merge with the other binary matrix
     * @param {BinaryMatrix} matrix
     */
    mergeWith(matrix) {

        if (!(matrix instanceof BinaryMatrix)) {
            return;
        }

        let _this = this;

        this.foreachFilled(function(x, y) {
            if (matrix.filled(x, y)) {
                _this.fill(x, y);
            }
        });
    }

    /**
     * Check if at least one tile around the tile has specified value
     * @param {number} x
     * @param {number} y
     * @param {number} deep
     * @return {boolean}
     */
    aroundFilled(x, y, deep) {
        return this.around(x, y, deep, 1);
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
            for(let i = 0; i < neighbors.length; i++) {
                map.fill(neighbors[i][0], neighbors[i][1]);
            }
        });

        return map;
    }

    /**
     * Apply callback to all neighbors of all
     * @param deep
     * @param callback
     * @return {Matrix}
     */
    foreachAllFilledNeighbors(deep, callback) {

        let _this = this;

        _this.foreach(function(x, y) {
            if (_this.filled(x, y)) {
                _this.foreachNeighbors(x, y, deep, function(nx, ny) {
                    callback(nx, ny);
                });
            }
        });

        return _this;
    }
}

class PointMatrix extends Matrix {

    // @TODO -> normalize each class after generation!
    normalize() {
        this.setRange(0, 1);
        return this;
    }
}

/**
 * @param {number} w
 * @param {number} h
 * @param {number} power
 * @return {PointMatrix}
 */
function createNoiseMap(w, h, power) {

    noise.seed(Math.random());

    let map = new PointMatrix(w, h);

    map.map(function(x, y) {
        return (noise.simplex2(x / power, y / power) + 1) * 0.5; // [0, 1] blurred height map
    });

    return map;
}

/**
 * Scale canvas image
 * @param {CanvasRenderingContext2D} context
 * @param {ImageData} imageData
 * @param {number} scale
 * @return {ImageData}
 */
function scaleImageData(context, imageData, scale) {

    let scaled = context.createImageData(imageData.width * scale, imageData.height * scale);
    let subLine = context.createImageData(scale, 1).data;

    for(let row = 0; row < imageData.height; row++) {
        for(let col = 0; col < imageData.width; col++) {

            let sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );

            for(let x = 0; x < scale; x++) {
                subLine.set(sourcePixel, x * 4);
            }

            for(let y = 0; y < scale; y++) {

                let destRow = row * scale + y;
                let destCol = col * scale;

                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
            }
        }
    }

    return scaled;
}

let timer = Date.now();

/**
 * @param {string} event
 */
function logTimeEvent(event) {
    let t = Date.now();
    console.log(event + ' [' + Math.max(0, (t - timer)) + 'ms]');
    timer = t;
}

let hexStorage = [];

/**
 * @param {string} hex
 * @return {array}
 */
function hexToRgb(hex) {

    if (typeof hexStorage[hex] === "undefined") {

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        result = result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;

        hexStorage[hex] = result;
    }

    return hexStorage[hex];
}

/**
 * Split [0-100] range into equal parts "distances"
 * @param {number} number
 * @param {number} start
 * @param {number} end
 * @return {[number]}
 */
function getEqualDistances(number, start, end) {

    let lines = [];

    if (number === 1) {
        lines = [(end - start) / 2];
    } else {
        let parts = (end - start) / (number - 1);
        for(let i = 0; i < number; i++) {
            lines.push(start + Math.floor(parts * i));
        }
    }

    return lines;
}

/**
 * Make a Hex color darken/brighten
 *
 * @param {string} col
 * @param {number} amt
 * @return {string}
 */
function LightenDarkenColor(col, amt) {

    let usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}