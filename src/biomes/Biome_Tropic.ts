import Config from "../../config.js";
import Biome from "./Biome.js";
import { toFraction} from "../helpers.js";

export default class Biome_Tropic extends Biome {
    getColor(): string {
        const altitude = toFraction(this.altitude, Config.MAX_BEACH_LEVEL, Config.MAX_LOWLAND_LEVEL);

        if (altitude < 0.33) {
            return Config.BIOME_COLORS[this.getName()][2];
        } else if (altitude < 0.66) {
            return Config.BIOME_COLORS[this.getName()][1];
        }

        return Config.BIOME_COLORS[this.getName()][0];
    }
}