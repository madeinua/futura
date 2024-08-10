import Matrix from "../structures/Matrix.js";
export class Layer extends Matrix {
    /**
     * Resets all cells in the layer to null.
     */
    reset() {
        this.map(() => null);
    }
}
