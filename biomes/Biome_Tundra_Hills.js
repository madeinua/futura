class Biome_Tundra_Hills extends Biome {

    static NAME = 'tundra-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Tundra_Hills, -(this.altitude - 0.5) * 200);
    }
}