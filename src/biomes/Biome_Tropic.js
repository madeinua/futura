import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Tropic extends Biome {
    constructor() {
        super(...arguments);
        this.type = "Biome_Tropic";
    }
    getColorsMinMax() {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        };
    }
    getBackground() {
        return Config.BIOME_IMAGES.Tropic;
    }
}
