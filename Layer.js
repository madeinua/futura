const LAYER_BIOMES = 0;
const LAYER_FOREST = 1;

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
     * @param {null|array|HTMLImageElement} value
     * @return {Matrix}
     */
    setTile(x, y, value) {

        if (value !== null && !(value instanceof DisplayCell)) {
            value = new DisplayCell(value, null);
        }

        return super.setTile(x, y, value);
    }
}