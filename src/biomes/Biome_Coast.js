import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Coast extends Biome {
    getColorsMinMax() {
        return {
            min: Config.MIN_COAST_LEVEL,
            max: Config.MIN_GROUND_LEVEL,
        };
    }
}
