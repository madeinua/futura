import Config from "../../config";
import Biome, {BiomeKey, ColorsMinMax} from "./Biome";

export default class Biome_Ocean extends Biome {

    getName(): BiomeKey {
        return 'Biome_Ocean';
    }

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