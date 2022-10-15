class Biome_Grass extends Biome {

    static NAME = 'grass';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Grass, (this.altitude - 0.5) * 200);
    }
}