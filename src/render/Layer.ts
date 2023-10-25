import Matrix from "../structures/Matrix.js"
import DisplayCell from "../render/DisplayCell.js"

export class Layer extends Matrix<null | DisplayCell> {

    getCell(x: number, y: number): null | DisplayCell {
        return super.getCell(x, y);
    }

    setCell(x: number, y: number, value: null | DisplayCell): this {
        return super.setCell(x, y, value);
    }

    reset() {
        this.map(null);
    }
}