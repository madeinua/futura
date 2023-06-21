import Biome from "./Biome.js";

export default class Biome_Ice_Rocks extends Biome {
    static BIOME_NAME = 'ice-rocks';

    displayCellWithBackground(): boolean {
        return true;
    }
}