class Biome_Grass extends Biome {

    static NAME = 'grass';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#659c29', (this.altitude - 0.5) * 200);
    }
}