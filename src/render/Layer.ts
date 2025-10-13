import Matrix from "../structures/Matrix";
import DisplayCell from "../render/DisplayCell";

export class Layer extends Matrix<null | DisplayCell> {

    /**
     * Resets all cells in the layer to null.
     */
    reset(): void {
        this.map(() => null);
    }
}