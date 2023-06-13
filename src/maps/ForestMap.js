import BinaryMatrix from "../structures/BinaryMatrix.js";

export default class ForestMap extends BinaryMatrix {

    /** @var {Matrix} */
    biomes;

    /** @var {Object} */
    config;

    /**
     * @param {Matrix} biomes
     * @param {Object} config
     * @return {ForestMap}
     */
    constructor(biomes, config) {
        super(0, config.WORLD_SIZE, config.WORLD_SIZE);

        this.biomes = biomes;
    }
}