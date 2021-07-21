class Biome_Tropic extends Biome {

    static NAME = 'tropic';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#3c8045', -(this.altitude - 0.5) * 200);
    }
}