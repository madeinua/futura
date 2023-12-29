import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Tropic extends Biome {
    getColorsMinMax() {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        };
    }
}
