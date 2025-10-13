import Config from "../../config";
import Biome, {BiomeKey, ColorsMinMax} from "./Biome";

export default class Biome_Tundra extends Biome {

    getName(): BiomeKey {
        return 'Biome_Tundra';
    }

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

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Tundra;
    }
}