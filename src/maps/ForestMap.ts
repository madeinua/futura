import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import BiomesMap from "./BiomesMap.js";

export default class ForestMap extends BinaryMatrix {

    readonly biomes: BiomesMap;

    constructor(biomes: BiomesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.biomes = biomes;
    }
}