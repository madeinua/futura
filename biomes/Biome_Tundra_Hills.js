class Biome_Tundra_Hills extends Biome {

    static NAME = 'tundra-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#686a54', -(this.altitude - 0.5) * 200);
    }
}