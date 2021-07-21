class Biome_Desert extends Biome {

    static NAME = 'desert';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#e8c57e', (this.altitude - 0.5) * 200);
    }
}