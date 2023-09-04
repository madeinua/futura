import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Grass extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 200);
    }
}
Biome_Grass.BIOME_NAME = 'grass';
export default Biome_Grass;
