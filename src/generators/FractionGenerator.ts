import Config from "../../config.js";
import {fromMiddleFractionValue, throwError} from "../helpers.js";
import Biome from "../biomes/Biome.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Fraction from "../human/Fraction.js";
import ForestMap from "../maps/ForestMap.js";
import BiomesMap from "../maps/BiomesMap.js";
import TemperatureMap from "../maps/TemperatureMap.js";
import IslandsMap from "../maps/IslandsMap";

export type FractionsGeneratorArgs = {
    oceanMap: BinaryMatrix,
    freshWaterMap: BinaryMatrix,
    temperatureMap: TemperatureMap,
    forestMap: ForestMap,
    biomesMap: BiomesMap,
    islandsMap: IslandsMap,
};

export default class FractionGenerator {

    readonly objects: FractionsGeneratorArgs;

    probabilitiesMap: NumericMatrix<number>;

    constructor(objects: FractionsGeneratorArgs) {
        this.objects = objects;
    }

    getBiomeProbability(biomeName: string): number {
        return Config.FRACTIONS.CREATE_PROBABILITIES.BIOMES[biomeName] ?? 0;
    }

    isTooSmallIsland(x: number, y: number): boolean {
        return this.objects.islandsMap.getCell(x, y) < Config.FRACTIONS.CREATE_PROBABILITIES.MIN_ISLAND_SIZE;
    }

    createOccurrenceProbabilityMap(): NumericMatrix {
        const _this: FractionGenerator = this,
            map = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        _this.objects.biomesMap.foreachValues(function (biome: Biome) {
            const biomeProbability = _this.getBiomeProbability(biome.getName());

            if (biomeProbability === 0 || _this.isTooSmallIsland(biome.x, biome.y)) {
                map.setCell(biome.x, biome.y, 0);
                return;
            }

            const oceanFactor = _this.objects.oceanMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_OCEAN : 1,
                waterFactor = _this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER : 1,
                temperatureFactor = fromMiddleFractionValue(_this.objects.temperatureMap.getCell(biome.x, biome.y)),
                isForest = _this.objects.forestMap.filled(biome.x, biome.y),
                forestFactor = isForest ? Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST : (
                    _this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST : 1
                );

            map.setCell(biome.x, biome.y, biomeProbability * oceanFactor * waterFactor * temperatureFactor * forestFactor);
        });

        return map;
    }

    generateFractions(count: number): Fraction[] {
        const _this: FractionGenerator = this;

        if (typeof _this.probabilitiesMap === 'undefined') {
            _this.probabilitiesMap = _this.createOccurrenceProbabilityMap();
        }

        let fractions = [],
            point: [x: number, y: number];

        for (let i = 0; i < count; i++) {
            point = _this.probabilitiesMap.getRandomWeightedPoint();

            if (point === null) {
                continue;
            }

            fractions.push(
                new Fraction(point[0], point[1], {
                    name: 'Fraction #' + (i + 1),
                    color: Config.FRACTIONS.COLORS[i]
                })
            );

            _this.probabilitiesMap.setCell(point[0], point[1], 0);
            _this.probabilitiesMap.foreachAroundRadius(point[0], point[1], 3, function (x: number, y: number) {
                _this.probabilitiesMap.setCell(x, y, 0);
            });
        }

        return fractions;
    }
}