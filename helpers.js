let errors = [];

/**
 * @param msg
 * @param {number} limit
 * @param {boolean} unique
 */
function throwError(msg, limit, unique) {

    limit = typeof limit == 'undefined' ? 5 : limit;
    unique = typeof unique == 'undefined' ? true : unique;

    if (errors.length < limit) {
        if (!unique || !errors.includes(msg)) {
            console.error(msg);
            errors.push(msg);
        }
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
     * @return {*}
     */
    add: function(tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
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
            for (let i = 0; i < filters.length; i++) {
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
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
};

/**
 * @param {number} value
 * @param {number} precision
 * @return {number}
 */
function round(value, precision) {
    return parseFloat(value.toFixed(precision));
}

/**
 * Create normal randomization (more chance to get 0.5 rather than 0 or 1)
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
 * Get normal random value between two float values
 * @param {number} float1
 * @param {number} float2
 * @return {number}
 */
function normalRandBetweenNumbers(float1, float2) {
    return normalRandom() * (float2 - float1) + float1;
}

/**
 * Get random value between two float values
 * @param {number} float1
 * @param {number} float2
 * @return {number}
 */
function randBetweenNumbers(float1, float2) {
    return Math.random() * (float2 - float1) + float1;
}

/**
 * Flip the coin!
 * True = matched, False = failed :D
 *
 * @param {number} chance
 * @return {boolean}
 */
function iAmLucky(chance) {
    return chance === 100
        ? true
        : (
            chance === 0
                ? 0
                : chance >= randBetweenNumbers(0, 100)
        );
}

/**
 * Convert range [0-1] to another range [min-max]
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function fromFraction(value, min, max) {
    return (value * (max - min)) + min;
}

/**
 * Convert middle-best value to highest-best value:
 * E.g. if the value 0.5 is the best option in between the range [0-1]
 * then the function will return 1 for 0.5 and 0 for 0/1.
 *
 * @param {number} highestValue
 * @param {number} value
 * @return {number}
 */
function fromMiddleFractionValue(highestValue, value) {

    if (highestValue === 0) {
        return 0;
    }

    return Math.max(0, 1 - Math.abs(value - highestValue)
        / (highestValue === 1 ? 1 : Math.min(highestValue, 1 - highestValue)));
}

/**
 * Convert range [minOld-maxOld] to another range [minNew-maxNew]
 * @param {number} value
 * @param {number} minOld
 * @param {number} maxOld
 * @param {number} minNew
 * @param {number} maxNew
 * @return {number}
 */
function changeRange(value, minOld, maxOld, minNew, maxNew) {
    return (((value - minOld) * (maxNew - minNew)) / (maxOld - minOld)) + minNew;
}

/**
 * Convert value in between [0-1] to RGB range [0-255]
 * @param {number} value
 * @return {number}
 */
function fractionToRGB(value) {
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

    let a = this.concat(),
        isArray = a.length > 0 && a[0] instanceof Array;

    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (
                isArray
                    ? a[i][0] === a[j][0] && a[i][1] === a[j][1]
                    : a[i] === a[j]
            ) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
};

/**
 * Retrieve closest distance to the tile
 * Note: Array([x1, y1], [x2, y2], ...)
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
Array.prototype.getClosestDistanceTo = function(x, y) {

    let closeness = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.length; i++) {
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

    for (let i = 0; i < arr.length; i++) {
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
 * Create 2D array
 * @param {number} width
 * @param {number} height
 * @param value
 * @return {[][]}
 */
function create2DArray(width, height, value) {
    return [...Array(height)].map(() => [...Array(width)].map(() => value));
}

/**
 * @param {number} size
 * @param {number} power
 * @return {PointMatrix}
 */
function createNoiseMap(size, power) {

    noise.seed(Math.random());

    let map = new PointMatrix(size, size);

    map.map(function(x, y) {
        return (noise.simplex2(x / power, y / power) + 1) * 0.5; // [0, 1] blurred height map
    });

    return map;
}

/**
 * @param {ImageData} image
 * @param {number} point
 * @param {Array} RGB
 */
function fillCanvasPixel(image, point, RGB) {
    image.data[point] = RGB[0];
    image.data[point + 1] = RGB[1];
    image.data[point + 2] = RGB[2];
    image.data[point + 3] = 255; // Alpha
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

    for (let row = 0; row < imageData.height; row++) {
        for (let col = 0; col < imageData.width; col++) {

            let sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );

            for (let x = 0; x < scale; x++) {
                subLine.set(sourcePixel, x * 4);
            }

            for (let x = 0; x < scale; x++) {

                let destRow = row * scale + x;
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
        for (let i = 0; i < number; i++) {
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