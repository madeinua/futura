import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Savanna extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}
Biome_Savanna.BIOME_NAME = 'savanna';
export default Biome_Savanna;
