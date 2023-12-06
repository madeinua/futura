import Config from "../../config.js";
import {fromMiddleFractionValue, throwError} from "../helpers.js";
import Biome from "../biomes/Biome.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Fraction from "../human/Fraction.js";
import ForestMap from "../maps/ForestMap.js";
import BiomesMap from "../maps/BiomesMap.js";
import TemperatureMap from "../maps/TemperatureMap.js";

export type FractionsGeneratorArgs = {
    freshWaterMap: BinaryMatrix,
    temperatureMap: TemperatureMap,
    forestMap: ForestMap,
    biomesMap: BiomesMap
};

export default class FractionGenerator {

    readonly objects: FractionsGeneratorArgs;

    constructor(objects: FractionsGeneratorArgs) {
        this.objects = objects;
    }

    getBiomeProbability(biomeName: string): number {
        return Config.FRACTIONS.CREATE_PROBABILITIES.BIOMES[biomeName] ?? 0;
    }

    createOccurrenceProbabilityMap(): NumericMatrix {
        const _this = this,
            map = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        _this.objects.biomesMap.foreachValues(function (biome: Biome) {
            const biomeProbability = _this.getBiomeProbability(biome.getName());

            if (biomeProbability === 0) {
                return;
            }

            const waterFactor = _this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER : 0,
                temperatureFactor = fromMiddleFractionValue(_this.objects.temperatureMap.getCell(biome.x, biome.y)),
                isForest = _this.objects.forestMap.filled(biome.x, biome.y),
                forestFactor = isForest ? Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST : (
                    _this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y) ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST : 1
                );

            map.setCell(biome.x, biome.y, biomeProbability * waterFactor * temperatureFactor * forestFactor);
        });

        return map;
    }

    generateFractions(count: number): Fraction[] {
        const probabilitiesMap = this.createOccurrenceProbabilityMap();

        let fractions = [],
            point: [x: number, y: number];

        for (let i = 0; i < 500; i++) {
            point = probabilitiesMap.getRandomWeightedPoint();

            if (point === null) {
                continue;
            }

            fractions.push(
                new Fraction(point[0], point[1], {
                    name: 'Fraction #' + (i + 1),
                    color: Config.FRACTIONS.COLORS[i]
                })
            );

            probabilitiesMap.setCell(point[0], point[1], 0);
            probabilitiesMap.foreachAroundRadius(point[0], point[1], 3, function (x: number, y: number) {
                probabilitiesMap.setCell(x, y, 0);
            });
        }

        return fractions;
    }
}