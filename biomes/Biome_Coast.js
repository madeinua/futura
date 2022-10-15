class Biome_Coast extends Biome {

    static NAME = 'coast';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Coast, (this.altitude - 0.2) * 800);
    }
}