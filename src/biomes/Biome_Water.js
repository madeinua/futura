import Config from "../../config.js";
import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
export default class Biome_Water extends Biome {
    constructor() {
        super(...arguments);
        this.type = "Biome_Water";
    }
    getColor() {
        return LightenDarkenColor(super.getColor(), this.altitude * 150);
    }
    getImage() {
        return null;
    }
    getBackground() {
        return Config.BIOME_IMAGES.Water;
    }
}
