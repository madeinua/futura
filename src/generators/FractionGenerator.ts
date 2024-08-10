import Config from "../../config.js";
import {fromMiddleFractionValue} from "../helpers.js";
import Biome from "../biomes/Biome.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Fraction from "../human/Fraction.js";
import ForestMap from "../maps/ForestMap.js";
import BiomesMap from "../maps/BiomesMap.js";
import TemperatureMap from "../maps/TemperatureMap.js";
import IslandsMap from "../maps/IslandsMap.js";

export type FractionsGeneratorArgs = {
    oceanMap: BinaryMatrix;
    freshWaterMap: BinaryMatrix;
    temperatureMap: TemperatureMap;
    forestMap: ForestMap;
    biomesMap: BiomesMap;
    islandsMap: IslandsMap;
};

export default class FractionGenerator {

    private readonly objects: FractionsGeneratorArgs;
    private probabilitiesMap: NumericMatrix<number>;

    constructor(objects: FractionsGeneratorArgs) {
        this.objects = objects;
        this.probabilitiesMap = this.createOccurrenceProbabilityMap();
    }

    private getBiomeProbability(biomeName: string): number {
        return Config.FRACTIONS.CREATE_PROBABILITIES.BIOMES[biomeName] ?? 0;
    }

    private isTooSmallIsland(x: number, y: number): boolean {
        return this.objects.islandsMap.getCell(x, y) < Config.FRACTIONS.CREATE_PROBABILITIES.MIN_ISLAND_SIZE;
    }

    private createOccurrenceProbabilityMap(): NumericMatrix<number> {
        const map = new NumericMatrix<number>(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.objects.biomesMap.foreachValues((biome: Biome) => {
            const biomeProbability = this.getBiomeProbability(biome.getName());

            if (biomeProbability === 0 || this.isTooSmallIsland(biome.x, biome.y)) {
                map.setCell(biome.x, biome.y, 0);
                return;
            }

            const oceanFactor = this.objects.oceanMap.hasFilledNeighbors(biome.x, biome.y)
                    ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_OCEAN
                    : 1,
                waterFactor = this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y)
                    ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER
                    : 1,
                altitudeFactor = Math.max(1 - biome.altitude, Config.MAX_HILLS_LEVEL),
                temperatureFactor = fromMiddleFractionValue(this.objects.temperatureMap.getCell(biome.x, biome.y)),
                isForest = this.objects.forestMap.filled(biome.x, biome.y),
                forestFactor = isForest
                    ? Config.FRACTIONS.CREATE_PROBABILITIES.IS_FOREST
                    : this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y)
                        ? Config.FRACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST
                        : 1;

            map.setCell(
                biome.x,
                biome.y,
                biomeProbability * oceanFactor * waterFactor * altitudeFactor * temperatureFactor * forestFactor
            );
        });

        return map;
    }

    generateFractions(count: number): Fraction[] {
        const fractions: Fraction[] = [];

        for (let i = 0; i < count; i++) {
            const point = this.probabilitiesMap.getRandomWeightedPoint();

            if (!point) {
                continue;
            }

            const [x, y] = point;

            fractions.push(
                new Fraction(x, y, {
                    name: `Fraction #${i + 1}`,
                    color: Config.FRACTIONS.COLORS[i]
                })
            );

            this.probabilitiesMap.setCell(x, y, 0);
            this.probabilitiesMap.foreachAroundRadius(x, y, 3, (nx: number, ny: number) => {
                this.probabilitiesMap.setCell(nx, ny, 0);
            });
        }

        return fractions;
    }
}