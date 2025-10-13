import Config from "../../config.js";
import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Water extends Biome {

    readonly type: string = "Biome_Water";

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