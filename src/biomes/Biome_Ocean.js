import Config from "../../config.js";
import Biome from "./Biome.js";
import { toFraction } from "../helpers.js";
export default class Biome_Ocean extends Biome {
    getColor() {
        const altitude = toFraction(this.altitude, 0, Config.MIN_COAST_LEVEL);
        if (altitude < 0.33) {
            return Config.BIOME_COLORS[this.getName()][0];
        }
        else if (altitude < 0.66) {
            return Config.BIOME_COLORS[this.getName()][1];
        }
        return Config.BIOME_COLORS[this.getName()][2];
    }
}
