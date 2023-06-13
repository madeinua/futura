import Matrix from "../structures/Matrix.js"
import DisplayCell from "../render/DisplayCell.js"

export const LAYER_BIOMES = 0;
export const LAYER_FOREST = 1;
export const LAYER_HABITAT = 2;
export const LAYER_ANIMALS = 3;

export class Layer extends Matrix {

    /**
     * @param {number} x
     * @param {number} y
     * @return {null|DisplayCell}
     */
    getCell(x, y) {
        return super.getCell(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {null|number|array|DisplayCell|HTMLImageElement} value
     * @return {Matrix}
     */
    setCell(x, y, value) {

        if (value !== null && !(value instanceof DisplayCell)) {
            value = new DisplayCell(value, null, false);
        }

        return super.setCell(x, y, value);
    }

    reset() {
        this.map(null);
    }
}