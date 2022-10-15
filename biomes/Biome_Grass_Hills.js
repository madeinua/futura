class Biome_Grass_Hills extends Biome {

    static NAME = 'grass-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Grass_Hills, -(this.altitude - 0.5) * 200);
    }
}