import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import BiomesMap from "./BiomesMap.js";

export default class ForestMap extends BinaryMatrix {

    biomes: BiomesMap;

    constructor(biomes: BiomesMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.biomes = biomes;
    }
}