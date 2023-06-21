import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Grass extends Biome {
    static BIOME_NAME = 'grass';

    getColor(): string {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}