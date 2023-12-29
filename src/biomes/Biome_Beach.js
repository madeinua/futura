import Config from "../../config.js";
import Biome from "./Biome.js";
export default class Biome_Beach extends Biome {
    getBackground() {
        return Config.BIOME_IMAGES.Beach;
    }
}
