let errorDisplayed = false;

/**
 * @param msg
 */
function throwError(msg) {
    if(!errorDisplayed) {
        console.error(msg);
        errorDisplayed = true;
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

        if(this.filters[tag]) {
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
 * @return {Array}
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
    return Math.random() * (float2 - float1) + float1;
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
            if(a[i] === a[j]) {
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

    let closest = false;

    for(let i = 0; i < this.length; i++) {

        if(this[i][0] === x && this[i][1] === y) {
            return 0;
        }

        let distance = Math.floor(Math.sqrt(Math.pow((x - this[i][0]), 2) + Math.pow((y - this[i][1]), 2)));
        if(!closest || closest > distance) {
            closest = distance;
        }
    }

    return closest;
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
        if(arr[i][0] === x && arr[i][1] === y) {
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

        // Initialization
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
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {Matrix}
     */
    setTile(x, y, value) {

        if(this.width > x && this.height > y) {
            this.__values[x][y] = value;
        }

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

        var arr = [],
            _this = this;

        _this.foreach(function(x, y) {

            if(typeof arr[x] === "undefined") {
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

        let CORNERS_EXCLUDED = [
            [-1, 0],
            [0, -1], [0, 1],
            [1, 0]
        ];

        let CORNERS_INCLUDED = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        let points = deep % 2 === 0 ? CORNERS_INCLUDED : CORNERS_EXCLUDED,
            w = this.getWidth(),
            h = this.getHeight(),
            neighbours = [];

        for(let i = 0; i < points.length; i++) {
            let nx = x + points[i][0];
            let ny = y + points[i][1];
            if(nx >= 0 && nx < w && ny >= 0 && ny < h) {
                neighbours.push([nx, ny]);
            }
        }

        if(deep > 2) {
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
     * Check if Matrix has at least one element with a specified value
     * @param {number} value
     * @return {boolean}
     */
    has(value) {

        let found = false,
            _this = this;

        this.foreach(function(x, y) {
            if(_this.getTile(x, y) === value) {
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
            if(this.getTile(surrounds[i][0], surrounds[i][1]) === value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Set min and max possible values to the matrix values
     * @param {number} min
     * @param {number} max
     */
    range(min, max) {
        if(this.constructor.isValidValue(min) && this.constructor.isValidValue(max)) {
            let _this = this;
            this.map(function(x, y) {
                let value = _this.getTile(x, y);
                if(value > max) {
                    return max;
                } else if(value < min) {
                    return min;
                } else {
                    return value;
                }
            });
        } else {
            console.error('Invalid min/max values for the range figure');
        }
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

        if(this.width > x && this.height > y) {
            this.__values[x][y] = value >= 0.5 ? 1 : 0;
        }

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
                if(this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
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
}

class PointMatrix extends Matrix {

    /**
     * Set tile value
     * @param {number} x
     * @param {number} y
     * @param {number} value
     * @return {Matrix}
     */
    setTile(x, y, value) {

        if(this.width > x && this.height > y) {

            if(value > 1) {
                value = 1;
            }

            if(value < 0) {
                value = 0;
            }

            this.__values[x][y] = value;
        }

        return this;
    };
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

    for(let row = 0; row < imageData.height; row++) {
        for(let col = 0; col < imageData.width; col++) {

            let sourcePixel = [
                imageData.data[(row * imageData.width + col) * 4],
                imageData.data[(row * imageData.width + col) * 4 + 1],
                imageData.data[(row * imageData.width + col) * 4 + 2],
                imageData.data[(row * imageData.width + col) * 4 + 3]
            ];

            for(let y = 0; y < scale; y++) {
                let destRow = row * scale + y;
                for(let x = 0; x < scale; x++) {
                    let destCol = col * scale + x;
                    for(let i = 0; i < 4; i++) {
                        scaled.data[(destRow * scaled.width + destCol) * 4 + i] = sourcePixel[i];
                    }
                }
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

    if(typeof hexStorage[hex] === "undefined") {

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
 * Make a Hex color darken/brighten
 *
 * @param {number} col
 * @param {number} amt
 * @return {string}
 */
function LightenDarkenColor(col, amt) {

    let usePound = false;

    if(col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if(r > 255) r = 255;
    else if(r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if(b > 255) b = 255;
    else if(b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if(g > 255) g = 255;
    else if(g < 0) g = 0;

    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);


}