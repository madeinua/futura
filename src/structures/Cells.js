/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 */
export function inCellList(cells, x, y) {
    return cells.some(([cellX, cellY]) => cellX === x && cellY === y);
}
/**
 * @param {CellsList} cells
 * @param {Cell} cell
 */
export function isCellInCellList(cells, cell) {
    return inCellList(cells, cell[0], cell[1]);
}
/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 * @return CellsList
 */
export function removeFromCellList(cells, x, y) {
    const index = cells.findIndex(([cellX, cellY]) => cellX === x && cellY === y);
    if (index !== -1) {
        cells.splice(index, 1);
    }
    return cells;
}
/**
 * @param {CellsList} cells
 * @param {Cell} cell
 * @return CellsList
 */
export function removeCellFromList(cells, cell) {
    return removeFromCellList(cells, cell[0], cell[1]);
}
/**
 * Returns a list of cells (as [x,y] pairs) within Manhattan distance < (radius+1).
 */
export function getAroundRadius(x, y, maxWidth, maxHeight, radius) {
    const result = [];
    const minX = Math.max(0, x - radius);
    const minY = Math.max(0, y - radius);
    const maxX = Math.min(maxWidth - 1, x + radius);
    const maxY = Math.min(maxHeight - 1, y + radius);
    const maxRadius = radius + 1;
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if ((nx !== x || ny !== y) && (Math.abs(x - nx) + Math.abs(y - ny) < maxRadius)) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}
/**
 * Returns a list of cells (as [x,y] pairs) in the 3×3 rectangle surrounding (x,y).
 */
export function getRectangleAround(x, y, maxWidth, maxHeight) {
    const result = [];
    const minX = Math.max(0, x - 1);
    const minY = Math.max(0, y - 1);
    const maxX = Math.min(maxWidth - 1, x + 1);
    const maxY = Math.min(maxHeight - 1, y + 1);
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if (nx !== x || ny !== y) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}
