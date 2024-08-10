import Matrix from "./Matrix.js";
import { fromFraction, changeRange, round } from "../helpers.js";
export default class NumericMatrix extends Matrix {
    toString() {
        return JSON.stringify(this.__values);
    }
    fromString(string) {
        this.setAll(JSON.parse(string));
    }
    addToCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) + value);
    }
    subtractFromCell(x, y, value) {
        return this.setCell(x, y, this.getCell(x, y) - value);
    }
    equals(matrix) {
        return this.__values.toString() === matrix.__values.toString();
    }
    getGrayscale(x, y) {
        return fromFraction(this.getCell(x, y), 0, 255);
    }
    sumNeighbors(x, y) {
        let sum = 0;
        this.foreachNeighbors(x, y, (nx, ny) => {
            sum += this.getCell(nx, ny);
        });
        return sum;
    }
    addToNeighborCells(x, y, value) {
        this.foreachNeighbors(x, y, (nx, ny) => {
            this.addToCell(nx, ny, value);
        });
        return this;
    }
    has(targetValue) {
        let found = false;
        this.foreachValues((value) => {
            if (value === targetValue) {
                found = true;
            }
        });
        return found;
    }
    setRange(min, max) {
        const values = this.getValuesList();
        const currMin = Math.min(...values);
        const currMax = Math.max(...values);
        this.map((x, y) => {
            return changeRange(this.getCell(x, y), currMin, currMax, min, max);
        });
        return this;
    }
    getMin() {
        return round(Math.min(...this.toList()), 2);
    }
    getMax() {
        return round(Math.max(...this.toList()), 2);
    }
    getAvgValue() {
        return round(this.sum() / (this.width * this.height), 2);
    }
    getRandomWeightedPoint() {
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
    sum() {
        return this.getValuesList().reduce((a, b) => a + b, 0);
    }
}
