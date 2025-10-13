import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Beach extends Biome {
    constructor() {
        super(...arguments);
        this.type = "Biome_Beach";
    }
    getBackground() {
        return Config.BIOME_IMAGES.Beach;
    }
}
