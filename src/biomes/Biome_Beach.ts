import Config from "../../config";
import Biome, {BiomeKey} from "./Biome";

export default class Biome_Beach extends Biome {

    getName(): BiomeKey {
        return 'Biome_Beach';
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Beach;
    }
}