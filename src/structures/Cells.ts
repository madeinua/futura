export type Cell = [number, number] // [x, y]
export type CellsList = Array<Cell> // [[x1, y1], [x2, y2], ...]
export type CellsArray = Array<CellsList> // [[x1, y1], [x2, y2], ...], [[x1, y1], [x2, y2], ...], ...]

/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 */
export function inCellList(cells: CellsList, x: number, y: number): boolean {
    return cells.some(([cellX, cellY]) => cellX === x && cellY === y);
}

/**
 * @param {CellsList} cells
 * @param {Cell} cell
 */
export function isCellInCellList(cells: CellsList, cell: Cell): boolean {
    return inCellList(cells, cell[0], cell[1]);
}

/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 * @return CellsList
 */
export function removeFromCellList(cells: CellsList, x: number, y: number): CellsList {
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
export function removeCellFromList(cells: CellsList, cell: Cell): CellsList {
    return removeFromCellList(cells, cell[0], cell[1]);
}

/**
 * Returns a list of cells (as [x,y] pairs) within Manhattan distance < (radius+1).
 */
export function getAroundRadius(
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    radius: number
): CellsList {
    const result: CellsList = [];
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
export function getRectangleAround(
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number
): CellsList {
    const result: CellsList = [];
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