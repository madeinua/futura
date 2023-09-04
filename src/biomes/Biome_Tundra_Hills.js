import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Tundra_Hills extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
Biome_Tundra_Hills.BIOME_NAME = 'tundra-hills';
export default Biome_Tundra_Hills;
