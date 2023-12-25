import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class ForestMap extends BinaryMatrix {
    constructor(biomes) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.biomes = biomes;
    }
}
