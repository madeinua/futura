import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Desert extends Biome {
    constructor() {
        super(...arguments);
        this.type = "Biome_Desert";
    }
    getColorsMinMax() {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        };
    }
    getBackground() {
        return Config.BIOME_IMAGES.Desert;
    }
}
