import Config from "../../config";
import Biome, {BiomeKey, ColorsMinMax} from "./Biome";

export default class Biome_Coast extends Biome {

    getName(): BiomeKey {
        return 'Biome_Coast';
    }

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