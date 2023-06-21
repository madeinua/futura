import Matrix from "../structures/Matrix.js";
import DisplayCell from "../render/DisplayCell.js";
export const LAYER_BIOMES = 0;
export const LAYER_FOREST = 1;
export const LAYER_HABITAT = 2;
export const LAYER_ANIMALS = 3;
export class Layer extends Matrix {
    getCell(x, y) {
        return super.getCell(x, y);
    }
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
