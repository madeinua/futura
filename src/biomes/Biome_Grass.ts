import Config from "../../config";
import Biome, {BiomeKey, ColorsMinMax} from "./Biome";

export default class Biome_Grass extends Biome {

    getName(): BiomeKey {
        return 'Biome_Grass';
    }

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MAX_BEACH_LEVEL,
            max: Config.MAX_LEVEL,
        }
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Grass;
    }
}