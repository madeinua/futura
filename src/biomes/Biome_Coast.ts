import Biome from "./Biome.js";
import {LightenDarkenColor} from "../helpers.js";

export default class Biome_Coast extends Biome {
    getColor(): string {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.2) * 800);
    }
}