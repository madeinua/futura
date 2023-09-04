import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Savanna_Hills extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
Biome_Savanna_Hills.BIOME_NAME = 'savanna-hills';
export default Biome_Savanna_Hills;
