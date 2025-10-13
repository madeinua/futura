import Config from "../../config";
import Biome, {BiomeKey} from "./Biome";
import {LightenDarkenColor} from "../helpers";

export default class Biome_Water extends Biome {

    getName(): BiomeKey {
        return 'Biome_Water';
    }

    getColor(): string {
        return LightenDarkenColor(super.getColor(), this.altitude * 150);
    }

    getImage(): string | null {
        return null;
    }

    getBackground(): string | null {
        return Config.BIOME_IMAGES.Water;
    }
}