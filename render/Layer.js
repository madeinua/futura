const LAYER_BIOMES = 0;
const LAYER_FOREST = 1;
const LAYER_HABITAT = 2;
const LAYER_ANIMALS = 3;

class Layer extends Matrix {

    /**
     * @param {number} x
     * @param {number} y
     * @return {null|DisplayCell}
     */
    getTile(x, y) {
        return super.getTile(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {null|number|array|DisplayCell|HTMLImageElement} value
     * @return {Matrix}
     */
    setTile(x, y, value) {

        if (value !== null && !(value instanceof DisplayCell)) {
            value = new DisplayCell(value, null);
        }

        return super.setTile(x, y, value);
    }

    reset() {
        this.map(null);
    }
}