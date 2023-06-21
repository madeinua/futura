import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Savanna extends Biome {
    static BIOME_NAME = 'savanna';

    getColor(): string {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}