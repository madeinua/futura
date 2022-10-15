class Biome_Tundra extends Biome {

    static NAME = 'tundra';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Tundra, (this.altitude - 0.5) * 200);
    }
}