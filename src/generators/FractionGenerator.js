import Config from "../../config.js";
import { fromMiddleFractionValue } from "../helpers.js";
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
    isTooSmallIsland(x, y) {
        return this.objects.islandsMap.getCell(x, y) < Config.FRACTIONS.CREATE_PROBABILITIES.MIN_ISLAND_SIZE;
    }
    createOccurrenceProbabilityMap() {
        const _this = this, map = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        _this.objects.biomesMap.foreachValues(function (biome) {
            const biomeProbability = _this.getBiomeProbability(biome.getName());
            if (biomeProbability === 0 || _this.isTooSmallIsland(biome.x, biome.y)) {
                map.setCell(biome.x, biome.y, 0);
                return;
            }
            const oceanFactor = _this.objects.oceanMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_OCEAN : 1, waterFactor = _this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER : 1, altitudeFactor = Math.max(1 - biome.altitude, Config.MAX_HILLS_LEVEL), temperatureFactor = fromMiddleFractionValue(_this.objects.temperatureMap.getCell(biome.x, biome.y)), isForest = _this.objects.forestMap.filled(biome.x, biome.y), forestFactor = isForest ? Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST : (_this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST : 1);
            map.setCell(biome.x, biome.y, biomeProbability * oceanFactor * waterFactor * altitudeFactor * temperatureFactor * forestFactor);
        });
        return map;
    }
    generateFractions(count) {
        const _this = this;
        if (typeof _this.probabilitiesMap === 'undefined') {
            _this.probabilitiesMap = _this.createOccurrenceProbabilityMap();
        }
        let fractions = [], point;
        for (let i = 0; i < count; i++) {
            point = _this.probabilitiesMap.getRandomWeightedPoint();
            if (point === null) {
                continue;
            }
            fractions.push(new Fraction(point[0], point[1], {
                name: 'Fraction #' + (i + 1),
                color: Config.FRACTIONS.COLORS[i]
            }));
            _this.probabilitiesMap.setCell(point[0], point[1], 0);
            _this.probabilitiesMap.foreachAroundRadius(point[0], point[1], 3, function (x, y) {
                _this.probabilitiesMap.setCell(x, y, 0);
            });
        }
        return fractions;
    }
}
