import Biome from "./Biome.js";
class Biome_Ice_Rocks extends Biome {
    displayCellWithBackground() {
        return true;
    }
}
Biome_Ice_Rocks.BIOME_NAME = 'ice-rocks';
export default Biome_Ice_Rocks;
