import Config from "../../config.js";
import {Filters, throwError} from "../helpers.js";
import Biome from "../biomes/Biome.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Fraction from "../human/Fraction.js";
import ForestMap from "../maps/ForestMap.js";
import BiomesMap from "../maps/BiomesMap.js";

export type FractionsGeneratorArgs = {
    freshWaterMap: BinaryMatrix,
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

            const distanceToWater = _this.objects.freshWaterMap.distanceTo(biome.x, biome.y, 5),
                waterFactor = Config.FRACTIONS.CREATE_PROBABILITIES.DISTANCE_TO_WATER / distanceToWater,
                isForest = _this.objects.freshWaterMap.filled(biome.x, biome.y),
                distanceToForest = _this.objects.freshWaterMap.distanceTo(biome.x, biome.y, 5),
                forestFactor = isForest ? -Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST : Config.FRACTIONS.CREATE_PROBABILITIES.DISTANCE_TO_FOREST / distanceToForest;

            map.setCell(biome.x, biome.y, biomeProbability + waterFactor + forestFactor);
        });

        return map;
    }

    generateFractions(count: number): Fraction[] {
        const probabilitiesMap = this.createOccurrenceProbabilityMap();

        let list = [],
            point: [x: number, y: number];

        for (let i = 0; i < count; i++) {
            do {
                point = probabilitiesMap.getRandomWeightedPoint();
            } while (list.includes(point));

            list.push(
                new Fraction(point[0], point[1], {
                    name: 'Fraction #' + (i + 1),
                    color: Config.FRACTIONS.COLORS[i]
                })
            );
        }

        throwError(list, 1, true);

        return list;
    }
}