class Biomes {

    // @TODO

    constructor() {
        
        this.biomes = [];
        
        this.biomes.push(Biome_Tropical_Forest);
        this.biomes.push(Biome_Temperate_Forest);
        this.biomes.push(Biome_Boreal_Forest);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Ground} ground
     * @return {boolean|Biome}
     */
    getBiome(x, y, ground) {
        
        for (let i in this.biomes) {
            if (this.biomes.hasOwnProperty(i) && this.biomes[i].matchConditions(x, y, ground)) {
                return new this.biomes[i];
            }
        }

        return false;
    }
}

class Biome {

    /**
     * @param {number} x
     * @param {number} y
     * @param {Ground} ground
     * @return {boolean}
     */
    static matchConditions (x, y, ground) {
        return false;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.constructor.name;
    }
}

class Biome_Tropical_Forest extends Biome
{
    /**
     * @param {number} x
     * @param {number} y
     * @param {Ground} ground
     * @return {boolean}
     */
    static matchConditions (x, y, ground) {
        return ground.getName() === Ground_Tropic.NAME
            || ground.getName() === Ground_Desert.NAME;
    }
}

class Biome_Temperate_Forest extends Biome
{
    /**
     * @param {number} x
     * @param {number} y
     * @param {Ground} ground
     * @return {boolean}
     */
    static matchConditions (x, y, ground) {
        return ground.getName() === Ground_Grass.NAME
            || ground.getName() === Ground_Tundra.NAME
            || ground.getName() === Ground_Savanna.NAME
    }
}

class Biome_Boreal_Forest extends Biome
{
    /**
     * @param {number} x
     * @param {number} y
     * @param {Ground} ground
     * @return {boolean}
     */
    static matchConditions (x, y, ground) {
        return ground.getName() === Ground_Grass_Hills.NAME
            || ground.getName() === Ground_Tundra_Hills.NAME;
    }
}