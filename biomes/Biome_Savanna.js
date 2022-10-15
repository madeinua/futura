class Biome_Savanna extends Biome {

    static NAME = 'savanna';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Savanna, (this.altitude - 0.5) * 200);
    }
}