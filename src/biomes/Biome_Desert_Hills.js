import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
export default class Biome_Desert_Hills extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
