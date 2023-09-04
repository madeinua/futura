import FractionGenerator from "../generators/FractionGenerator.js";
export default class FractionsOperator {
    constructor(freshWaterMap, forestMap, biomesMap) {
        this.fractionsGenerator = new FractionGenerator({
            freshWaterMap: freshWaterMap,
            forestMap: forestMap,
            biomesMap: biomesMap
        });
    }
    createFractions(count) {
        return this.fractionsGenerator.generateFractions(count);
    }
}
