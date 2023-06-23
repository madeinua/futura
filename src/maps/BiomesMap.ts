import Config from "../../config.js";
import Matrix from "../structures/Matrix.js";
import Biome from "../biomes/Biome.js";

export default class BiomesMap extends Matrix<Biome> {
    constructor() {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
    }
}