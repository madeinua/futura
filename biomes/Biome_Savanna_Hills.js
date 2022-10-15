class Biome_Savanna_Hills extends Biome {

    static NAME = 'savanna-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Savanna_Hills, -(this.altitude - 0.5) * 200);
    }
}