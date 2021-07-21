class Biome_Grass_Hills extends Biome {

    static NAME = 'grass-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#778e5d', -(this.altitude - 0.5) * 200);
    }
}