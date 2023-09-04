import Biome from "./Biome.js";
import { LightenDarkenColor } from "../helpers.js";
class Biome_Rocks extends Biome {
    getColor() {
        return LightenDarkenColor(super.getColor(), -(this.altitude - 0.5) * 200);
    }
    displayCellWithBackground() {
        return true;
    }
}
Biome_Rocks.BIOME_NAME = 'rocks';
export default Biome_Rocks;
