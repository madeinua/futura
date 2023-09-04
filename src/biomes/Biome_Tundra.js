import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Tundra extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}
Biome_Tundra.BIOME_NAME = 'tundra';
export default Biome_Tundra;
