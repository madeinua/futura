import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Water extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), (this.altitude - 0.5) * 250);
    }
}
Biome_Water.BIOME_NAME = 'water';
export default Biome_Water;
