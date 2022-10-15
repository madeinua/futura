class Biome_Tropic extends Biome {

    static NAME = 'tropic';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Tropic, -(this.altitude - 0.5) * 200);
    }
}