import FractionGenerator from "../generators/FractionGenerator.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import ForestMap from "../maps/ForestMap.js";
import BiomesMap from "../maps/BiomesMap.js";

export default class FractionsOperator {
    fractionsGenerator: FractionGenerator;

    constructor(freshWaterMap: BinaryMatrix, forestMap: ForestMap, biomesMap: BiomesMap) {
        this.fractionsGenerator = new FractionGenerator({
            freshWaterMap: freshWaterMap,
            forestMap: forestMap,
            biomesMap: biomesMap
        });
    }

    createFractions(count: number) {
        return this.fractionsGenerator.generateFractions(count);
    }
}