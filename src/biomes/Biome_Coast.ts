import Config from "../../config.js";
import Biome, {ColorsMinMax} from "./Biome.js";

export default class Biome_Coast extends Biome {

    readonly type: string = "Biome_Coast";

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MIN_COAST_LEVEL,
            max: Config.MIN_GROUND_LEVEL,
        }
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Ocean;
    }
}