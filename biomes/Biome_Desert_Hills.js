class Biome_Desert_Hills extends Biome {

    static NAME = 'desert-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Desert_Hills, -(this.altitude - 0.5) * 200);
    }
}