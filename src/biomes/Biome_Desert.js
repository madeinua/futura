import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Desert extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}
Biome_Desert.BIOME_NAME = 'desert';
export default Biome_Desert;
