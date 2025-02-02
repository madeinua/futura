import Matrix from "./Matrix.js";
import { fromFraction, changeRange, round } from "../helpers.js";
export default class NumericMatrix extends Matrix {
    toString() {
        return JSON.stringify(this.__values);
    }
    fromString(str) {
        this.setAll(JSON.parse(str));
    }
    addToCell(x, y, value) {
        const current = this.getCell(x, y);
        return this.setCell(x, y, (current + value));
    }
    subtractFromCell(x, y, value) {
        const current = this.getCell(x, y);
        return this.setCell(x, y, (current - value));
    }
    equals(matrix) {
        const a = this.__values;
        const b = matrix.__values;
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length) {
                return false;
            }
            for (let j = 0; j < a[i].length; j++) {
                if (a[i][j] !== b[i][j])
                    return false;
            }
        }
        return true;
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
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (__values[x][y] === targetValue) {
                    return true;
                }
            }
        }
        return false;
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
        const { width, height, __values } = this;
        let minVal = Infinity;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v < minVal) {
                    minVal = v;
                }
            }
        }
        return round(minVal, 2);
    }
    getMax() {
        const { width, height, __values } = this;
        let maxVal = -Infinity;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v > maxVal) {
                    maxVal = v;
                }
            }
        }
        return round(maxVal, 2);
    }
    getAvgValue() {
        return round(this.sum() / (this.width * this.height), 2);
    }
    getRandomWeightedPoint() {
        const matrix = this.getValues();
        const rows = matrix.length;
        if (rows === 0) {
            return null;
        }
        const rowSums = new Array(rows);
        let totalSum = 0;
        for (let i = 0; i < rows; i++) {
            let rowSum = 0;
            const row = matrix[i];
            for (let j = 0; j < row.length; j++) {
                rowSum += row[j];
            }
            rowSums[i] = rowSum;
            totalSum += rowSum;
        }
        let randomValue = Math.random() * totalSum;
        let rowIndex = 0;
        for (let i = 0; i < rows; i++) {
            randomValue -= rowSums[i];
            if (randomValue <= 0) {
                rowIndex = i;
                break;
            }
        }
        const selectedRow = matrix[rowIndex];
        const selectedRowSum = rowSums[rowIndex];
        let randomColValue = Math.random() * selectedRowSum;
        let colIndex = 0;
        for (let j = 0; j < selectedRow.length; j++) {
            randomColValue -= selectedRow[j];
            if (randomColValue <= 0) {
                colIndex = j;
                break;
            }
        }
        return [rowIndex, colIndex];
    }
    sum() {
        const { width, height, __values } = this;
        let total = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                total += __values[x][y];
            }
        }
        return total;
    }
}
