import Config from "../../config.js";
import Biome, {ColorsMinMax} from "./Biome.js";

export default class Biome_Ocean extends Biome {

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MIN_LEVEL,
            max: Config.MIN_COAST_LEVEL,
        }
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Ocean;
    }
}