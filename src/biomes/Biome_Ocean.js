import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Ocean extends Biome {
    getColorsMinMax() {
        return {
            min: Config.MIN_LEVEL,
            max: Config.MIN_COAST_LEVEL,
        };
    }
    getBackground() {
        return Config.BIOME_IMAGES.Ocean;
    }
}
