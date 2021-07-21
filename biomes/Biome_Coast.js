class Biome_Coast extends Biome {

    static NAME = 'coast';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#003eb2', (this.altitude - 0.2) * 800);
    }
}