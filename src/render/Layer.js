import Matrix from "../structures/Matrix.js";
export class Layer extends Matrix {
    getCell(x, y) {
        return super.getCell(x, y);
    }
    setCell(x, y, value) {
        return super.setCell(x, y, value);
    }
    reset() {
        this.map(null);
    }
}
