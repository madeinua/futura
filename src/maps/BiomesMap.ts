import Config from "../../config.js";
import Matrix from "../structures/Matrix.js";

export default class BiomesMap extends Matrix {
    constructor() {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
    }
}