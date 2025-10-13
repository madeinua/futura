import Config from "../../config.js";
import Biome, {ColorsMinMax} from "./Biome.js";

export default class Biome_Tropic extends Biome {

    readonly type: string = "Biome_Tropic";

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        }
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Tropic;
    }
}