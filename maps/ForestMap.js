class ForestMap extends BinaryMatrix {

    /** @var {Matrix} */
    biomes;

    /**
     * @param {Matrix} biomes
     * @return {ForestMap}
     */
    constructor(biomes) {
        super();

        this.biomes = biomes;
    }
}