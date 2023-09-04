import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Desert_Hills extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
}
Biome_Desert_Hills.BIOME_NAME = 'desert-hills';
export default Biome_Desert_Hills;
