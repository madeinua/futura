import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Savanna_Hills extends Biome {
    static BIOME_NAME = 'savanna-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}