import Config from "../../config.js";
import Biome from "./Biome.js";
import { toFraction} from "../helpers.js";

export default class Biome_Desert_Hills extends Biome {
    getColor(): string {
        const altitude = toFraction(this.altitude, Config.MAX_LOWLAND_LEVEL, Config.MAX_HILLS_LEVEL);

        if (altitude < 0.5) {
            return Config.BIOME_COLORS[this.getName()][1];
        }

        return Config.BIOME_COLORS[this.getName()][0];
    }
}