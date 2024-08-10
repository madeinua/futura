import Matrix from "./Matrix.js";
import {fromFraction, changeRange, round} from "../helpers.js";

export default class NumericMatrix<T extends number = number> extends Matrix<T> {

    toString(): string {
        return JSON.stringify(this.__values);
    }

    fromString(string: string): void {
        this.setAll(JSON.parse(string));
    }

    addToCell(x: number, y: number, value: T): this {
        return this.setCell(x, y, this.getCell(x, y) + value as T);
    }

    subtractFromCell(x: number, y: number, value: T): this {
        return this.setCell(x, y, this.getCell(x, y) - value as T);
    }

    equals(matrix: NumericMatrix): boolean {
        return this.__values.toString() === matrix.__values.toString();
    }

    getGrayscale(x: number, y: number): number {
        return fromFraction(this.getCell(x, y), 0, 255);
    }

    sumNeighbors(x: number, y: number): number {
        let sum = 0;
        this.foreachNeighbors(x, y, (nx, ny) => {
            sum += this.getCell(nx, ny);
        });
        return sum;
    }

    addToNeighborCells(x: number, y: number, value: number): this {
        this.foreachNeighbors(x, y, (nx, ny) => {
            this.addToCell(nx, ny, value as T);
        });
        return this;
    }

    has(targetValue: number): boolean {
        let found = false;
        this.foreachValues((value: number) => {
            if (value === targetValue) {
                found = true;
            }
        });
        return found;
    }

    setRange(min: number, max: number): this {
        const values = this.getValuesList();
        const currMin = Math.min(...values);
        const currMax = Math.max(...values);

        this.map((x: number, y: number) => {
            return changeRange(
                this.getCell(x, y),
                currMin,
                currMax,
                min,
                max
            );
        });

        return this;
    }

    getMin(): number {
        return round(Math.min(...this.toList()), 2);
    }

    getMax(): number {
        return round(Math.max(...this.toList()), 2);
    }

    getAvgValue(): number {
        return round(this.sum() / (this.width * this.height), 2);
    }

    getRandomWeightedPoint(): [number, number] | null {
        const matrix = this.getValues();
        const rowSums = matrix.map(row => row.reduce((acc, val) => acc + val, 0));
        const totalSum = rowSums.reduce((acc, sum) => acc + sum, 0);

        const randomValue = Math.random() * totalSum;

        let cumulativeSum = 0;
        let rowIndex = 0;

        for (let i = 0; i < matrix.length; i++) {
            cumulativeSum += rowSums[i];
            if (randomValue <= cumulativeSum) {
                rowIndex = i;
                break;
            }
        }

        const selectedRowSum = rowSums[rowIndex];
        const randomColValue = Math.random() * selectedRowSum;

        cumulativeSum = 0;
        let colIndex = 0;

        for (let j = 0; j < matrix[rowIndex].length; j++) {
            cumulativeSum += matrix[rowIndex][j];
            if (randomColValue <= cumulativeSum) {
                colIndex = j;
                break;
            }
        }

        return [rowIndex, colIndex];
    }

    sum(): number {
        return this.getValuesList().reduce((a, b) => a + b, 0);
    }
}