/**
 * Creates a 2D array of the specified dimensions, filled with the given value.
 */
export function create2DArray(width, height, value) {
    const arr = new Array(height);
    for (let i = 0; i < height; i++) {
        arr[i] = new Array(width).fill(value);
    }
    return arr;
}
/**
 * Checks if the given 2D array (list of [x,y] points) contains the specified point.
 */
export function arrayHasPoint(arr, x, y) {
    return arr.some(([px, py]) => px === x && py === y);
}
