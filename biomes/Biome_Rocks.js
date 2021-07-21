class Biome_Rocks extends Biome {

    static NAME = 'rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#726f62', (this.altitude - 0.5) * 250);
    }
}