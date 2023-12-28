import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Coast extends Biome {
    getColor() {
        // Calculate the midpoint
        let midpoint = (Config.MIN_COAST_LEVEL + Config.MAX_OCEAN_LEVEL) / 2;
        if (this.altitude >= Config.MIN_COAST_LEVEL && this.altitude < midpoint) {
            return Config.BIOME_COLORS[this.getName()][0];
        }
        return Config.BIOME_COLORS[this.getName()][1];
    }
}
