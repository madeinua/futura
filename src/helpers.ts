import {Array2D} from "./structures/Array2D";
import Matrix from "./structures/Matrix";
import NumericMatrix from "./structures/NumericMatrix";
import {Cell} from "./structures/Cells";

export type RGB = [number, number, number];
export type RGBa = RGB | [number, number, number, number];

const errors: any[] = [];

export function throwError(
    msg: any,
    limit: number = 5,
    unique: boolean = true
): void {
    if (errors.length < limit) {
        if (!unique || !errors.includes(msg)) {
            console.error(msg);
            errors.push(msg);
        }
    }
}

export const Filters = {
    filters: {} as Record<string, Array<(val: any) => any>>,

    add(tag: string, filter: (val: any) => any): void {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
    },

    apply(tag: string, val: any): any {
        const list = this.filters[tag];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                val = list[i](val);
            }
        }
        return val;
    },
};

/** Returns a unique auto‐incremented step value. */
export const getStep = (() => {
    let step = 0;
    return () => ++step;
})();

/** Rounds the number to a fixed precision. */
export function round(value: number, precision: number): number {
    return parseFloat(value.toFixed(precision));
}

/**
 * Generates a normally distributed random number in [0,1].
 * Uses the Box–Muller transform with a do/while loop to avoid recursion.
 */
export function normalRandom(): number {
    let num: number;

    do {
        const u = Math.random();
        const v = Math.random();
        num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
    } while (num > 1 || num < 0);

    return num;
}

/** Returns a normally distributed random value between two floats. */
export function normalRandBetweenNumbers(float1: number, float2: number): number {
    return normalRandom() * (float2 - float1) + float1;
}

/** Returns a random value between two float values. */
export function randBetweenNumbers(float1: number, float2: number): number {
    return Math.random() * (float2 - float1) + float1;
}

/**
 * Simulates a coin flip given a chance (0-100).
 */
export function iAmLucky(chance: number): boolean {
    if (chance >= 100) return true;
    if (chance <= 0) return false;
    return Math.random() < chance / 100;
}

/** Converts a fraction [0,1] to a value in the specified range [min,max]. */
export function fromFraction(value: number, min: number, max: number): number {
    return value * (max - min) + min;
}

/** Converts a value in the range [min,max] to a fraction [0,1]. */
export function toFraction(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

/**
 * Scores how close `value` (0..1) is to `targetValue` (default 0.5).
 * 1 at the target, linearly down to 0 at the farthest endpoint(s).
 * Examples (target=0.5): value 0 or 1 -> 0, value 0.5 -> 1.
 */
export function fromMiddleFractionValue(value: number, targetValue = 0.5): number {
    const v = Math.min(1, Math.max(0, value));
    const t = Math.min(1, Math.max(0, targetValue));
    const maxDist = Math.max(t, 1 - t);
    const score = 1 - Math.abs(v - t) / maxDist;

    return Math.max(0, Math.min(1, score));
}

/**
 * Maps a value from one range to another.
 */
export function changeRange(
    value: number,
    minOld: number,
    maxOld: number,
    minNew: number,
    maxNew: number
): number {
    return ((value - minOld) * (maxNew - minNew)) / (maxOld - minOld) + minNew;
}

/** Converts a fraction [0,1] to an RGB value [0,255]. */
export function fractionToRGB(value: number): number {
    return Math.round(value * 255);
}

/** Converts an RGB value [0,255] to a fraction [0,1]. */
export function RGBToFraction(value: number): number {
    return value / 255;
}

/** Retrieves the Euclidean distance between two points. */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Darkens or lightens a hex color by a given amount.
 * Caches results to avoid re‑computations.
 */
const colorCache: { [key: string]: string } = {};

export function LightenDarkenColor(col: string, amt: number): string {
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
export function rgbToRgba(rgb: RGB, alpha: number): RGBa {
    return [rgb[0], rgb[1], rgb[2], alpha];
}

/**
 * Converts an RGBA color to a hex string.
 */
export function rgbToHex(rgba: RGBa): string {
    const hex = rgba
        .map((value: number) => value.toString(16).padStart(2, "0"))
        .join("");

    return `#${hex}`;
}

/**
 * Computes the area of a polygon defined by a list of points.
 */
export function getPolygonAreaSize(coords: Array2D): number {
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
export function fillCanvasPixel(
    image: ImageData,
    point: number,
    RGBa: RGBa,
    blendFactor: number = 0.5
): void {
    if (
        image.data[point] === 0 &&
        image.data[point + 1] === 0 &&
        image.data[point + 2] === 0
    ) {
        image.data[point] = RGBa[0];
        image.data[point + 1] = RGBa[1];
        image.data[point + 2] = RGBa[2];
        image.data[point + 3] = RGBa[3] ?? 255;
    } else {
        image.data[point] = image.data[point] * blendFactor + RGBa[0] * (1 - blendFactor);
        image.data[point + 1] = image.data[point + 1] * blendFactor + RGBa[1] * (1 - blendFactor);
        image.data[point + 2] = image.data[point + 2] * blendFactor + RGBa[2] * (1 - blendFactor);
        image.data[point + 3] = 255;
    }
}

/**
 * Scales canvas image data by the given width and height factors.
 */
export function scaleImageData(
    context: CanvasRenderingContext2D,
    imageData: ImageData,
    widthScale: number,
    heightScale: number
): ImageData {
    const srcWidth = imageData.width;
    const srcHeight = imageData.height;
    const destWidth = srcWidth * widthScale;
    const destHeight = srcHeight * heightScale;
    const scaled: ImageData = context.createImageData(destWidth, destHeight);
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

let timer: number = Date.now();

export function getTimeForEvent(): number {
    return Math.max(0, Date.now() - timer);
}

export function logTimeEvent(event: string): void {
    const t = Date.now();
    console.log(`${event} [${Math.max(0, t - timer)}ms]`);
    timer = t;
}

export function resetTimeEvent(): void {
    timer = Date.now();
}

const hexStorage: { [hex: string]: RGB } = {};

/**
 * Converts a hex color string to an RGB array.
 * @param hex - The hex color string (e.g. "#RRGGBB" or "#RGB").
 * @returns An array representing the RGB color [R, G, B].
 */
export function hexToRgb(hex: string): RGB {
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

/**
 * Preloads all PNG images found in the given object and its nested objects.
 * @param {Record<string, any>} obj
 * @param {HTMLImageElement[]} container
 */
export async function preloadImages(obj: Record<string, any>, container: HTMLImageElement[]): Promise<void> {
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            await preloadImages(obj[key], container);
        } else if (typeof obj[key] === "string" && obj[key].endsWith(".png")) {
            try {
                (container as (HTMLImageElement[] & Record<string, HTMLImageElement>))[obj[key]] = (await createImage(obj[key]))!;
            } catch (error) {
                console.error(`Failed to preload image: ${obj[key]}`, error);
            }
        }
    }
}

/**
 * Creates and decodes an HTMLImageElement from the given source URL.
 * @param {string | null} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement | null>} A promise that resolves to the HTMLImageElement or null.
 */
export async function createImage(
    src: string | null
): Promise<HTMLImageElement | null> {
    if (src === null) return null;
    const img = new Image();
    img.src = src;
    await img.decode();
    return img;
}

/**
 * Linearly interpolates between two colors.
 *
 * @param {number, number, number} color1 - The start color as [R, G, B]
 * @param {number, number, number} color2 - The end color as [R, G, B]
 * @param {number} factor - The interpolation factor (0.0 to 1.0)
 * @returns {number, number, number} The interpolated color as [R, G, B]
 */
export function interpolateColor(
    color1: [number, number, number],
    color2: [number, number, number],
    factor: number
): [number, number, number] {
    return [
        Math.round(color1[0] + factor * (color2[0] - color1[0])),
        Math.round(color1[1] + factor * (color2[1] - color1[1])),
        Math.round(color1[2] + factor * (color2[2] - color1[2])),
    ];
}

/**
 * Draws a color map on a canvas element with the given ID using the provided matrix.
 * @param {string} id - The ID of the canvas element.
 * @param {Matrix} map - The matrix containing color data.
 */
export function drawColorMap(id: string, map: Matrix) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;

    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const image = ctx.createImageData(canvas.width, canvas.height);

    for (let x = 0; x < map.getWidth(); x++) {
        for (let y = 0; y < map.getHeight(); y++) {
            fillCanvasPixel(
                image,
                (x + y * canvas.width) * 4,
                map.getCell(x, y).getHexColor()
            );
        }
    }

    ctx.putImageData(image, 0, 0);
}

/**
 * Draws a colored map onto a canvas by mapping each cell’s value (assumed to be between 0 and 255)
 * to a color determined by linear interpolation between the provided start and end colors.
 *
 * @param {string} id - The ID of the canvas element to draw on.
 * @param {NumericMatrix} map - The numeric matrix containing values to map to colors.
 * @param {number, number, number} startColor - The color representing the lowest values (e.g. blue for cold areas).
 * @param {number, number, number} endColor - The color representing the highest values (e.g. red for hot areas).
 */
export function drawColoredMap(
    id: string,
    map: NumericMatrix,
    startColor: [number, number, number],
    endColor: [number, number, number]
) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = ctx.createImageData(canvas.width, canvas.height);

    // For each cell, compute its color based on the normalized value.
    map.foreach((x: number, y: number) => {

        const gray = map.getGrayscale(x, y);
        const factor = gray / 255; // Normalize to [0, 1]

        // Interpolate between the two provided colors.
        const color: [number, number, number] = interpolateColor(startColor, endColor, factor);

        // Compute the pixel's starting index in the ImageData array.
        const point = (x + y * canvas.width) * 4;

        // Set the pixel color.
        image.data[point] = color[0]; // Red
        image.data[point + 1] = color[1]; // Green
        image.data[point + 2] = color[2]; // Blue
        image.data[point + 3] = 255; // Alpha
    });

    ctx.putImageData(image, 0, 0);
}

/***
 * Retrieves the camera position from the given input field.
 * @param {HTMLInputElement} coordinatesField - The input field containing the camera coordinates in "x,y" format.
 * @returns {Cell} The camera position as a Cell [x, y].
 */
export function getCameraPosition(coordinatesField: HTMLInputElement): Cell {
    const point = coordinatesField.value.split(',');
    let x = 0;
    let y = 0;

    if (point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }

    return [x, y];
}