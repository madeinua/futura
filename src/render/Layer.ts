import Matrix from "../structures/Matrix.js";
import DisplayCell from "../render/DisplayCell.js";

export class Layer extends Matrix<null | DisplayCell> {

    /**
     * Resets all cells in the layer to null.
     */
    reset(): void {
        this.map(() => null);
    }
}