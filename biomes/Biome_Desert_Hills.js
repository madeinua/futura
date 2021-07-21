class Biome_Desert_Hills extends Biome {

    static NAME = 'desert-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#c4a37e', -(this.altitude - 0.5) * 200);
    }
}