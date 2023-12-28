import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
export default class Biome_Water extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), this.altitude * 250);
    }
}
