import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Rocks extends Biome {
    static BIOME_NAME = 'rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200)
    }

    /**
     * @returns {boolean}
     */
    displayCellWithBackground() {
        return true;
    }
}