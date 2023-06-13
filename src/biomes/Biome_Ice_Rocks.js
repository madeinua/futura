import Biome from "./Biome.js";

export default class Biome_Ice_Rocks extends Biome {

    static NAME = 'ice-rocks';

    /**
     * @returns {boolean}
     */
    displayCellWithBackground() {
        return true;
    }
}