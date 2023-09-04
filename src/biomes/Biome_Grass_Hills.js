import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Grass_Hills extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
Biome_Grass_Hills.BIOME_NAME = 'grass-hills';
export default Biome_Grass_Hills;
