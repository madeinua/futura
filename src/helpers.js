var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const errors = [];
export function throwError(msg, limit = 5, unique = true) {
    if (errors.length < limit) {
        if (!unique || !errors.includes(msg)) {
            console.error(msg);
            errors.push(msg);
        }
    }
}
export const Filters = {
    filters: {},
    add(tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
    },
    apply(tag, val) {
        const list = this.filters[tag];
        if (list) {
            for (let i = 0, len = list.length; i < len; i++) {
                val = list[i](val);
            }
        }
        return val;
    },
};
let step = 0;
/** Returns a unique auto‐incremented step value. */
export function getStep() {
    return ++step;
}
/** Rounds the number to a fixed precision. */
export function round(value, precision) {
    return parseFloat(value.toFixed(precision));
}
/**
 * Generates a normally distributed random number in [0,1].
 * Uses the Box–Muller transform with a do/while loop to avoid recursion.
 */
export function normalRandom() {
    let num;
    do {
        const u = Math.random();
        const v = Math.random();
        num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
    } while (num > 1 || num < 0);
    return num;
}
/** Returns a normally distributed random value between two floats. */
export function normalRandBetweenNumbers(float1, float2) {
    return normalRandom() * (float2 - float1) + float1;
}
/** Returns a random value between two float values. */
export function randBetweenNumbers(float1, float2) {
    return Math.random() * (float2 - float1) + float1;
}
/**
 * Simulates a coin flip given a chance (0-100).
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
/** Converts a fraction [0,1] to a value in the specified range [min,max]. */
export function fromFraction(value, min, max) {
    return value * (max - min) + min;
}
/** Converts a value in the range [min,max] to a fraction [0,1]. */
export function toFraction(value, min, max) {
    return (value - min) / (max - min);
}
/**
 * Converts a value to a “middle‐best” score.
 * For example, if 0.5 is optimal in [0,1], then values closer to 0.5 yield higher scores.
 */
export function fromMiddleFractionValue(value, targetValue = 0.5) {
    return Math.max(0, 1 - Math.abs(value - targetValue));
}
/**
 * Maps a value from one range to another.
 */
export function changeRange(value, minOld, maxOld, minNew, maxNew) {
    return ((value - minOld) * (maxNew - minNew)) / (maxOld - minOld) + minNew;
}
/**
 * Rounds the number to the next “slice” in the range.
 * Example: roundToNextSlice(0.45, 0, 1, 10) => 0.4
 */
export function roundToNextSlice(number, rangeStart, rangeEnd, N) {
    if (number > rangeEnd || number < rangeStart) {
        throwError(`Number ${number} is out of range [${rangeStart}, ${rangeEnd}]`, 1, true);
    }
    const sliceSize = (rangeEnd - rangeStart) / N;
    const adjustedNumber = (number - rangeStart) / sliceSize;
    let roundedNumber = Math.ceil(adjustedNumber);
    if (adjustedNumber === Math.floor(adjustedNumber)) {
        roundedNumber = Math.floor(adjustedNumber);
    }
    return roundedNumber * sliceSize + rangeStart;
}
/** Converts a fraction [0,1] to an RGB value [0,255]. */
export function fractionToRGB(value) {
    return Math.round(value * 255);
}
/** Converts an RGB value [0,255] to a fraction [0,1]. */
export function RGBToFraction(value) {
    return value / 255;
}
/** Retrieves the Euclidean distance between two points. */
export function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Darkens or lightens a hex color by a given amount.
 * Caches results to avoid re‑computations.
 */
const colorCache = {};
export function LightenDarkenColor(col, amt) {
    const cacheKey = col + "_" + amt;
    if (colorCache[cacheKey]) {
        return colorCache[cacheKey];
    }
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    let g = (num & 0x0000ff) + amt;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    let b = ((num >> 8) & 0x00ff) + amt;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    const newColor = (usePound ? "#" : "") +
        ("000000" + ((r << 16) | (b << 8) | g).toString(16)).slice(-6);
    colorCache[cacheKey] = newColor;
    return newColor;
}
/**
 * Converts an RGB color and alpha value to an RGBA array.
 */
export function rgbToRgba(rgb, alpha) {
    return [rgb[0], rgb[1], rgb[2], alpha];
}
/**
 * Converts an RGBA color to a hex string.
 */
export function rgbToHex(rgba) {
    const hex = rgba
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");
    return `#${hex}`;
}
/**
 * Computes the area of a polygon defined by a list of points.
 */
export function getPolygonAreaSize(coords) {
    let area = 0;
    for (let i = 0, len = coords.length; i < len; i++) {
        const j = (i + 1) % len;
        area += coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1];
    }
    return area / 2;
}
/**
 * Fills a canvas pixel with the given RGBA color.
 * Blends with existing color if present.
 */
export function fillCanvasPixel(image, point, RGBa, blendFactor = 0.5) {
    var _a;
    if (image.data[point] === 0 &&
        image.data[point + 1] === 0 &&
        image.data[point + 2] === 0) {
        image.data[point] = RGBa[0];
        image.data[point + 1] = RGBa[1];
        image.data[point + 2] = RGBa[2];
        image.data[point + 3] = (_a = RGBa[3]) !== null && _a !== void 0 ? _a : 255;
    }
    else {
        image.data[point] = image.data[point] * blendFactor + RGBa[0] * (1 - blendFactor);
        image.data[point + 1] = image.data[point + 1] * blendFactor + RGBa[1] * (1 - blendFactor);
        image.data[point + 2] = image.data[point + 2] * blendFactor + RGBa[2] * (1 - blendFactor);
        image.data[point + 3] = 255;
    }
}
/**
 * Scales canvas image data by the given width and height factors.
 */
export function scaleImageData(context, imageData, widthScale, heightScale) {
    const srcWidth = imageData.width;
    const srcHeight = imageData.height;
    const destWidth = srcWidth * widthScale;
    const destHeight = srcHeight * heightScale;
    const scaled = context.createImageData(destWidth, destHeight);
    const subLine = context.createImageData(widthScale, 1).data;
    for (let row = 0; row < srcHeight; row++) {
        for (let col = 0; col < srcWidth; col++) {
            const srcIndex = (row * srcWidth + col) * 4;
            const sourcePixel = imageData.data.subarray(srcIndex, srcIndex + 4);
            for (let x = 0; x < widthScale; x++) {
                subLine.set(sourcePixel, x * 4);
            }
            for (let y = 0; y < heightScale; y++) {
                const destRow = row * heightScale + y;
                const destCol = col * widthScale;
                scaled.data.set(subLine, (destRow * destWidth + destCol) * 4);
            }
        }
    }
    return scaled;
}
let timer = Date.now();
export function getTimeForEvent() {
    return Math.max(0, Date.now() - timer);
}
export function logTimeEvent(event) {
    const t = Date.now();
    console.log(`${event} [${Math.max(0, t - timer)}ms]`);
    timer = t;
}
export function resetTimeEvent() {
    timer = Date.now();
}
const hexStorage = {};
export function hexToRgb(hex) {
    if (!hex) {
        return [0, 0, 0];
    }
    if (!hexStorage[hex]) {
        // Expand shorthand (e.g. "03F") to full form ("0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        hexStorage[hex] = result
            ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            : [0, 0, 0];
    }
    return hexStorage[hex];
}
export function preloadImages(obj, container) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const key in obj) {
            if (typeof obj[key] === "object") {
                yield preloadImages(obj[key], container);
            }
            else if (typeof obj[key] === "string" && obj[key].endsWith(".png")) {
                try {
                    container[obj[key]] = yield createImage(obj[key]);
                }
                catch (error) {
                    console.error(`Failed to preload image: ${obj[key]}`, error);
                }
            }
        }
    });
}
export function createImage(src) {
    return __awaiter(this, void 0, void 0, function* () {
        if (src === null)
            return null;
        const img = new Image();
        img.src = src;
        yield img.decode();
        return img;
    });
}
