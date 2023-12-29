import Config from "../../config.js";
import Biome, {ColorsMinMax} from "./Biome.js";

export default class Biome_Tundra extends Biome {

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        }
    }

    getImage(): null | string {

        if (this.isMountains) {
            return Config.BIOME_IMAGES.Rocks[1];
        }

        return super.getImage();
    }
}