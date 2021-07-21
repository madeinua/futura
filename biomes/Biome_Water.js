class Biome_Water extends Biome {

    static NAME = 'water';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#74aece', (this.altitude - 0.5) * 250);
    }
}