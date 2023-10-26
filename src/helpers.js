var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let errors = [];
export function throwError(msg, limit, unique) {
    limit = typeof limit == 'undefined' ? 5 : limit;
    unique = typeof unique == 'undefined' ? true : unique;
    if (errors.length < limit) {
        if (!unique || !errors.includes(msg)) {
            console.error(msg);
            errors.push(msg);
        }
    }
}
export let Filters = {
    filters: {},
    add: function (tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
    },
    apply: function (tag, val) {
        if (this.filters[tag]) {
            const filters = this.filters[tag];
            for (let i = 0; i < filters.length; i++) {
                val = filters[i](val);
            }
        }
        return val;
    }
};
let step = 0;
/**
 * Always return unique autoincrement value
 */
export function getStep() {
    return ++step;
}
export function round(value, precision) {
    return parseFloat(value.toFixed(precision));
}
export function getAroundRadius(x, y, maxWidth, maxHeight, radius) {
    const result = [], minX = Math.max(0, x - radius), minY = Math.max(0, y - radius), maxX = Math.min(maxWidth - 1, x + radius), maxY = Math.min(maxHeight - 1, y + radius), maxRadius = radius + 1;
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if (!(nx === x && ny === y)
                && ((x > nx ? x - nx : nx - x)
                    +
                        (y > ny ? y - ny : ny - y)
                    <
                        maxRadius)) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}
export function getRectangleAround(x, y, maxWidth, maxHeight) {
    const result = [], minX = Math.max(0, x - 1), minY = Math.max(0, y - 1), maxX = Math.min(maxWidth - 1, x + 1), maxY = Math.min(maxHeight - 1, y + 1);
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if (!(nx === x && ny === y)) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}
/**
 * Create normal randomization (more chance to get 0.5 rather than 0 or 1)
 * @see https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 */
export function normalRandom() {
    let u = 0, v = 0;
    while (u === 0) {
        u = Math.random();
    }
    while (v === 0) {
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
 */
export function normalRandBetweenNumbers(float1, float2) {
    return normalRandom() * (float2 - float1) + float1;
}
/**
 * Get random value between two float values
 */
export function randBetweenNumbers(float1, float2) {
    return Math.random() * (float2 - float1) + float1;
}
/**
 * Flip the coin!
 * True = matched, False = failed :D
 */
export function iAmLucky(chance) {
    if (chance >= 100) {
        return true;
    }
    if (chance <= 0) {
        return false;
    }
    return chance >= randBetweenNumbers(0, 100);
}
/**
 * Convert range [0-1] to another range [min-max]
 */
export function fromFraction(value, min, max) {
    return (value * (max - min)) + min;
}
/**
 * Convert range [min-max] to [0-1]
 */
export function toFraction(value, min, max) {
    return (value - min) / (max - min);
}
/**
 * Convert middle-best value to highest-best value:
 * E.g. if the value 0.5 is the best option in between the range [0-1]
 * then the function will return 1 for 0.5 and 0 for 0/1.
 */
export function fromMiddleFractionValue(value, targetValue = 0.5) {
    return Math.max(0, 1 - Math.abs(value - targetValue));
}
/**
 * Convert range [minOld-maxOld] to another range [minNew-maxNew]
 */
export function changeRange(value, minOld, maxOld, minNew, maxNew) {
    return (((value - minOld) * (maxNew - minNew)) / (maxOld - minOld)) + minNew;
}
/**
 * Convert value in between [0-1] to RGB range [0-255]
 */
export function fractionToRGB(value) {
    return value * 255;
}
/**
 * Retrieve distance between two points
 */
export function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
/**
 * Check if the cell is available in the array
 */
export function arrayHasPoint(arr, x, y) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === x && arr[i][1] === y) {
            return true;
        }
    }
    return false;
}
/**
 * Create 2D array
 */
export function create2DArray(width, height, value) {
    return [...Array(height)].map(() => [...Array(width)].map(() => value));
}
export function fillCanvasPixel(image, point, RGBa) {
    image.data[point] = RGBa[0];
    image.data[point + 1] = RGBa[1];
    image.data[point + 2] = RGBa[2];
    image.data[point + 3] = typeof RGBa[3] === 'undefined' ? 255 : RGBa[3];
}
/**
 * Scale canvas image
 */
export function scaleImageData(context, imageData, widthScale, heightScale) {
    const scaled = context.createImageData(imageData.width * widthScale, imageData.height * heightScale);
    const subLine = context.createImageData(widthScale, 1).data;
    for (let row = 0; row < imageData.height; row++) {
        for (let col = 0; col < imageData.width; col++) {
            const sourcePixel = imageData.data.subarray((row * imageData.width + col) * 4, (row * imageData.width + col) * 4 + 4);
            for (let x = 0; x < widthScale; x++) {
                subLine.set(sourcePixel, x * 4);
            }
            for (let y = 0; y < heightScale; y++) {
                const destRow = row * heightScale + y;
                const destCol = col * widthScale;
                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
            }
        }
    }
    return scaled;
}
let timer = Date.now();
export function getTimeForEvent() {
    return Math.max(0, (Date.now() - timer));
}
export function logTimeEvent(event) {
    const t = Date.now();
    console.log(event + ' [' + Math.max(0, (t - timer)) + 'ms]');
    timer = t;
}
export function resetTimeEvent() {
    timer = Date.now();
}
const hexStorage = [];
export function hexToRgb(hex) {
    if (typeof hex === 'undefined') {
        return [0, 0, 0];
    }
    if (typeof hexStorage[hex] === "undefined") {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        hexStorage[hex] = result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }
    return hexStorage[hex];
}
export function rgbToHex(rgb) {
    const hex = rgb.map((value) => value.toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
}
const colorCache = {};
/**
 * Make a Hex color darken/brighten
 */
export function LightenDarkenColor(col, amt) {
    const cacheKey = col + '_' + amt;
    if (colorCache[cacheKey]) {
        return colorCache[cacheKey];
    }
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255)
        r = 255;
    else if (r < 0)
        r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255)
        b = 255;
    else if (b < 0)
        b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255)
        g = 255;
    else if (g < 0)
        g = 0;
    colorCache[cacheKey] = (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
    return colorCache[cacheKey];
}
export function getPolygonAreaSize(coords) {
    let area = 0, j;
    for (let i = 0; i < coords.length; i++) {
        j = (i + 1) % coords.length;
        area += coords[i][0] * coords[j][1];
        area -= coords[j][0] * coords[i][1];
    }
    return area / 2;
}
export function createImage(src) {
    return __awaiter(this, void 0, void 0, function* () {
        if (src === null) {
            return null;
        }
        const img = new Image();
        img.src = src;
        yield img.decode();
        return img;
    });
}
