import Config from "../../config.js";
import { throwError } from "../helpers.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Fraction from "../human/Fraction.js";
export default class FractionGenerator {
    constructor(objects) {
        this.objects = objects;
    }
    getBiomeProbability(biomeName) {
        var _a;
        return (_a = Config.FRACTIONS.CREATE_PROBABILITIES.BIOMES[biomeName]) !== null && _a !== void 0 ? _a : 0;
    }
    createOccurrenceProbabilityMap() {
        const _this = this, map = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        _this.objects.biomesMap.foreachValues(function (biome) {
            const biomeProbability = _this.getBiomeProbability(biome.getName());
            if (biomeProbability === 0) {
                return;
            }
            const waterFactor = _this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER : 0, isForest = _this.objects.forestMap.filled(biome.x, biome.y), forestFactor = isForest ? Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST : (_this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST : 1);
            map.setCell(biome.x, biome.y, biomeProbability * waterFactor * forestFactor);
        });
        return map;
    }
    generateFractions(count) {
        const probabilitiesMap = this.createOccurrenceProbabilityMap();
        let list = [], point;
        for (let i = 0; i < count; i++) {
            do {
                point = probabilitiesMap.getRandomWeightedPoint();
            } while (list.includes(point));
            list.push(new Fraction(point[0], point[1], {
                name: 'Fraction #' + (i + 1),
                color: Config.FRACTIONS.COLORS[i]
            }));
        }
        throwError(list, 1, true);
        return list;
    }
}
