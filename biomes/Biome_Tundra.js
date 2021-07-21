class Biome_Tundra extends Biome {

    static NAME = 'tundra';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#9c9f73', (this.altitude - 0.5) * 200);
    }
}