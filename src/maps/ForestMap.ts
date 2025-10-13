import Config from "../../config";
import BinaryMatrix from "../structures/BinaryMatrix";
import BiomesMap from "./BiomesMap";

export default class ForestMap extends BinaryMatrix {

    readonly biomes: BiomesMap;

    constructor(biomes: BiomesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.biomes = biomes;
    }
}