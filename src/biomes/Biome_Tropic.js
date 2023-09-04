import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Tropic extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
Biome_Tropic.BIOME_NAME = 'tropic';
export default Biome_Tropic;
