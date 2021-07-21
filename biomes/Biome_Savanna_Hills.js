class Biome_Savanna_Hills extends Biome {

    static NAME = 'savanna-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#7f7946', -(this.altitude - 0.5) * 200);
    }
}