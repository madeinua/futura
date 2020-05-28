class Biomes {

    // @TODO
    BIOME_FOREST_TROPICAL = 1;
    BIOME_FOREST_TEMPARATE = 2;
    BIOME_FOREST_BOREAL = 3;

    constructor() {

    }

    /**
     * @param {Ground} ground
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    findBiomeType(ground, x, y) {



        return '';
    };

    /**
     * @param {Ground} ground
     * @param {number} x
     * @param {number} y
     * @return {Biome}
     */
    getBiome(ground, x, y) {
        return new Biome(
            this.findBiomeType(ground, x, y)
        );
    }
}

class Biome {

    /**
     * @param {number} type
     */
    constructor(type) {
        this.type = type;
    }

    /**
     * @return {number}
     */
    getType() {
        return this.type;
    };
}