import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class ForestMap extends BinaryMatrix {
    constructor(biomes) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.biomes = biomes;
    }
}
