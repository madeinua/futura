class Biome_Water extends Biome {

    static NAME = 'water';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Water, (this.altitude - 0.5) * 250);
    }
}