import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Tundra extends Biome {
    constructor() {
        super(...arguments);
        this.type = "Biome_Tundra";
    }
    getColorsMinMax() {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        };
    }
    getImage() {
        if (this.isMountains) {
            return Config.BIOME_IMAGES.Rocks[1];
        }
        return super.getImage();
    }
    getBackground() {
        return Config.BIOME_IMAGES.Tundra;
    }
}
