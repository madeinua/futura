import Config from "../../config.js";
import Biome from "./Biome.js";

export default class Biome_Beach extends Biome {

    readonly type: string = "Biome_Beach";

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Beach;
    }
}