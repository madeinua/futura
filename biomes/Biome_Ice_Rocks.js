class Biome_Ice_Rocks extends Biome {

    static NAME = 'ice-rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Ice_Rocks, (this.altitude - 0.5) * 500);
    }
}