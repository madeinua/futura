import NumericMatrix from "./NumericMatrix.js";
import {distance, round, getPolygonAreaSize} from "../helpers.js";
import {CellsList} from "./Cells.js";
import {Array2D} from "./Array2D.js";

export default class BinaryMatrix extends NumericMatrix {

    constructor(width: number, height: number, fill: 0 | 1 = 0) {
        super(width, height);
        // Initialize every cell to the provided fill value.
        this.map(fill);
    }

    clone(): BinaryMatrix {
        const matrix = new BinaryMatrix(this.width, this.height, 0);
        matrix.__values = this.__values.map((row) => row.slice()) as Array2D<0 | 1>;

        return matrix;
    }

    getFilledCells(): CellsList {
        const cells: CellsList = [];
        this.foreachFilled((x, y) => cells.push([x, y]));

        return cells;
    }

    getUnfilledCells(): CellsList {
        const cells: CellsList = [];
        this.foreachUnfilled((x, y) => cells.push([x, y]));

        return cells;
    }

    fill(x: number, y: number): this {
        this.setCell(x, y, 1);

        return this;
    }

    fillAll(): this {
        this.foreachUnfilled((x, y) => this.fill(x, y));

        return this;
    }

    unfill(x: number, y: number): this {
        this.setCell(x, y, 0);

        return this;
    }

    unfillAll(): this {
        this.foreachFilled((x, y) => this.unfill(x, y));

        return this;
    }

    countFilled(): number {
        let count = 0;

        this.foreachFilled(() => count++);

        return count;
    }

    hasFilled(): boolean {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    filled(x: number, y: number): boolean {
        return this.getCell(x, y) === 1;
    }

    foreachFilled(callback: (x: number, y: number) => void): void {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    foreachUnfilled(callback: (x: number, y: number) => void): void {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (!this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    distanceTo(x: number, y: number, max: number): number {
        let result = Number.MAX_SAFE_INTEGER;
        const {width, height} = this;
        const minX = Math.max(0, x - max);
        const maxX = Math.min(width - 1, x + max);
        const minY = Math.max(0, y - max);
        const maxY = Math.min(height - 1, y + max);

        for (let nx = minX; nx <= maxX; nx++) {
            for (let ny = minY; ny <= maxY; ny++) {
                if (this.filled(nx, ny)) {
                    const d = distance(nx, ny, x, y);

                    if (d < result) {
                        result = d;
                        if (result === 0) {
                            return 0; // Early exit if exact match found
                        }
                    }
                }
            }
        }

        return result;
    }

    aroundFilled(x: number, y: number, max: number): boolean {
        return max >= this.distanceTo(x, y, max);
    }

    combineWith(matrix: BinaryMatrix): this {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // Use logical OR for binary values.
                this.__values[x][y] = this.__values[x][y] || matrix.__values[x][y];
            }
        }

        return this;
    }

    diff(matrix: BinaryMatrix): BinaryMatrix {
        matrix.foreachFilled((x, y) => this.unfill(x, y));

        return this;
    }

    diffCells(cells: CellsList): BinaryMatrix {
        for (const [cx, cy] of cells) {
            if (this.filled(cx, cy)) {
                this.unfill(cx, cy);
            }
        }

        return this;
    }

    intersect(matrix: BinaryMatrix): BinaryMatrix {
        const {width, height} = this;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y) && !matrix.filled(x, y)) {
                    this.unfill(x, y);
                }
            }
        }

        return this;
    }

    getFilledNeighbors(x: number, y: number): CellsList {
        const result: CellsList = [];

        this.foreachNeighbors(x, y, (nx, ny) => {
            if (this.filled(nx, ny)) {
                result.push([nx, ny]);
            }
        });

        return result;
    }

    hasFilledNeighbors(x: number, y: number): boolean {
        let found = false;

        this.foreachNeighbors(x, y, (nx, ny) => {
            if (this.filled(nx, ny)) {
                found = true;
                return true; // stops iteration
            }

            return false;
        });

        return found;
    }

    hasUnfilledNeighbors(x: number, y: number): boolean {
        // Assuming 8 neighbors in a full grid. If fewer than 8 are filled, at least one is unfilled.
        return this.getFilledNeighbors(x, y).length < 8;
    }

    foreachFilledAround(x: number, y: number, callback: (x: number, y: number) => void): void {
        const neighbors = this.getNeighbors(x, y);

        for (const [nx, ny] of neighbors) {
            if (this.filled(nx, ny)) {
                callback(nx, ny);
            }
        }
    }

    foreachFilledAroundRadiusToAllCells(
        callback: (nx: number, ny: number, cx: number, cy: number) => void,
        radius: number
    ): void {
        const filledCells = this.getFilledCells();

        filledCells.forEach(([cx, cy]) => {
            this.foreachAroundRadius(cx, cy, radius, (nx, ny) => {
                callback(nx, ny, cx, cy);
            });
        });
    }

    getSize(): number {
        const totalCells = this.width * this.height;
        const filledCount = this.getFilledCells().length;

        return round(filledCount / totalCells, 2) * 100;
    }

    getSizeFromPoint(startX: number, startY: number): number {

        if (!this.filled(startX, startY)) {
            return 0;
        }

        const coords: CellsList = [];

        // For each of the four cardinal directions, extend until an unfilled cell or boundary is reached.
        for (let d = 0; d < 4; d++) {
            let sx = startX;
            let sy = startY;

            while (true) {
                if (d === 0) sx++;       // Right
                else if (d === 1) sy++;  // Down
                else if (d === 2) sx--;  // Left
                else if (d === 3) sy--;  // Up

                // Break if out of bounds.
                if (sx < 0 || sy < 0 || sx >= this.width || sy >= this.height) {
                    break;
                }

                if (!this.filled(sx, sy)) {
                    coords.push([sx, sy]);
                    break;
                }
            }
        }

        return Math.abs(getPolygonAreaSize(coords));
    }
}