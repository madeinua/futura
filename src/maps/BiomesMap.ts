import Config from "../../config";
import Matrix from "../structures/Matrix";
import Biome from "../biomes/Biome";

export default class BiomesMap extends Matrix<Biome> {
    constructor() {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
    }
}