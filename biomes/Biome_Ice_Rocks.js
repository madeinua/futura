class Biome_Ice_Rocks extends Biome {

    static NAME = 'ice-rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#eeeeee', (this.altitude - 0.5) * 500);
    }
}