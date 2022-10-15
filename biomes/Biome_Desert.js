class Biome_Desert extends Biome {

    static NAME = 'desert';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Desert, (this.altitude - 0.5) * 200);
    }
}