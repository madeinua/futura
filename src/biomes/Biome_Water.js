import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Water extends Biome {
    static BIOME_NAME = 'water';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 250);
    }
}