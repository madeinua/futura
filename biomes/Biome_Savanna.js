class Biome_Savanna extends Biome {

    static NAME = 'savanna';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#9b9e3f', (this.altitude - 0.5) * 200);
    }
}