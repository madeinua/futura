import Matrix from "./Matrix.js";
import {fromFraction, changeRange, round} from "../helpers.js";

export default class NumericMatrix<T extends number = number> extends Matrix<T> {

    toString = function (): string {
        return JSON.stringify(this.__values);
    }

    fromString = function (string: string): void {
        this.setAll(
            JSON.parse(string)
        );
    }

    /**
     * Add value to a current cell value
     */
    addToCell(x: number, y: number, value: T): this {
        return this.setCell(x, y, this.getCell(x, y) + value as T);
    }

    /**
     * Subtract value from a current cell value
     */
    subtractFromCell(x: number, y: number, value: T): this {
        return this.setCell(x, y, this.getCell(x, y) - value as T);
    }

    /**
     * Compare current matrix to the other one
     */
    equals(matrix: NumericMatrix): boolean {
        return this.__values.toString() === matrix.__values.toString();
    }

    /**
     * Get matrix greyscale level
     */
    getGrayscale(x: number, y: number): number {
        return fromFraction(this.getCell(x, y), 0, 255);
    }

    /**
     * Count sum of all neighbors
     */
    sumNeighbors(x: number, y: number): number {

        let sum = 0;
        const _this: NumericMatrix = this;

        _this.foreachNeighbors(x, y, function (nx: number, ny: number): void {
            sum += _this.getCell(nx, ny);
        });

        return sum;
    }

    /**
     * Add value to all neighbors of the point [x, y]
     */
    addToNeighborCells(x: number, y: number, value: number): this {
        const _this: NumericMatrix = this;

        _this.foreachNeighbors(x, y, function (nx: number, ny: number): void {
            _this.addToCell(nx, ny, value);
        });

        return this;
    }

    /**
     * Check if Matrix has at least one element with a specified value
     */
    has(targetValue: number): boolean {

        let found = false;
        const _this: NumericMatrix = this;

        _this.foreachValues(function (value: number): void {
            if (value === targetValue) {
                found = true;
            }
        });

        return found;
    }

    /**
     * Scale matrix to fit min/max ranges
     */
    setRange(min: number, max: number): this {

        const _this: NumericMatrix = this,
            values = _this.getValuesList(),
            currMin = Math.min(...values),
            currMax = Math.max(...values);

        _this.map(function (x: number, y: number): number {
            return changeRange(
                _this.getCell(x, y),
                currMin,
                currMax,
                min,
                max
            );
        });

        return this;
    }

    /**
     * Retrieve minimum value
     */
    getMin(): number {
        return round(Math.min.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve maximum value
     */
    getMax(): number {
        return round(Math.max.apply(null, this.toList()), 2);
    }

    /**
     * Retrieve average value
     */
    getAvgValue(): number {
        return round(this.getValuesList().reduce((a, b) => a + b, 0) / (this.width * this.height), 2);
    }

    /**
     * Retrieve a random point based on the values of the matrix
     */
    getRandomWeightedPoint(): [number, number] {
        const matrix = this.getValues();

        // Calculate the total sum of values in each row
        const rowSums: number[] = matrix.map((row) => row.reduce((acc, val) => acc + val, 0));

        // Calculate the total sum of row sums
        const totalSum: number = rowSums.reduce((acc, sum) => acc + sum, 0);

        // Generate a random number between 0 and the totalSum
        const randomValue: number = Math.random() * totalSum;

        // Initialize variables to keep track of the cumulative sum
        let cumulativeSum: number = 0;
        let rowIndex: number = 0;

        // Find the row index based on probabilities
        for (let i: number = 0; i < matrix.length; i++) {
            cumulativeSum += rowSums[i];
            if (randomValue <= cumulativeSum) {
                rowIndex = i; // Store the selected row index
                break;
            }
        }

        // Calculate the total sum of values in the selected row
        const selectedRowSum: number = rowSums[rowIndex];

        // Generate a random number between 0 and the selectedRowSum
        const randomColValue: number = Math.random() * selectedRowSum;

        // Initialize variables to keep track of the cumulative sum for columns
        cumulativeSum = 0;
        let colIndex: number = 0;

        // Find the column index within the selected row based on probabilities
        for (let j: number = 0; j < matrix[rowIndex].length; j++) {
            cumulativeSum += matrix[rowIndex][j];
            if (randomColValue <= cumulativeSum) {
                colIndex = j; // Store the selected column index
                break;
            }
        }

        // Return the random coordinate as [row, col]
        return [rowIndex, colIndex];
    }
}