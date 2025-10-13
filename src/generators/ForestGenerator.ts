import Config from "../../config";
import {changeRange, iAmLucky} from "../helpers";
import {CellsList} from "../structures/Cells";
import ForestMap from "../maps/ForestMap";
import AltitudeMap from "../maps/AltitudeMap";
import HumidityMap from "../maps/HumidityMap";

type ForestGeneratorMults = {
    [key: string]: number;
};

export default class ForestGenerator {
    readonly altitudeMap: AltitudeMap;
    readonly humidityMap: HumidityMap;
    readonly maxForestCells: number;
    readonly groundCreateMults: ForestGeneratorMults = {};
    readonly notAllowedCells: CellsList = [];
    private notAllowedSet: Set<string> = new Set();
    readonly minCreateIntensity: number;

    constructor(altitudeMap: AltitudeMap, humidityMap: HumidityMap) {
        this.altitudeMap = altitudeMap;
        this.humidityMap = humidityMap;
        this.maxForestCells = Math.ceil(
            altitudeMap.getLandCellsCount() * Config.FOREST_LIMIT / 100
        );
        this.minCreateIntensity = Math.ceil(this.maxForestCells / 10);

        this.initializeGroundCreateMults();
        this.setNotAllowedCells();
    }

    private initializeGroundCreateMults(): void {
        const maxGroundMult = Math.max(
            ...Object.values(Config.FOREST_GROUNDS_MULTS).map(v => v ?? 0)
        );

        for (const [key, value] of Object.entries(Config.FOREST_GROUNDS_MULTS)) {
            this.groundCreateMults[key] = changeRange(
                value ?? 0,
                0,
                maxGroundMult,
                0,
                Config.FOREST_CREATE_MULTS.GROUND
            );
        }
    }

    private setNotAllowedCells(): void {
        this.altitudeMap.foreachValues((altitude: number, x: number, y: number): void => {
            if (altitude > Config.MAX_HILLS_LEVEL) {
                this.notAllowedCells.push([x, y]);
                this.notAllowedSet.add(`${x},${y}`);
            }
        });
    }

    /**
     * Randomly picks a subset of up to `count` elements from the given array.
     * This method does not shuffle the entire array, but instead picks random
     * elements and removes them from a copy.
     */
    private pickRandomSubset<T>(array: T[], count: number): T[] {
        const result: T[] = [];
        const arr = array.slice(); // copy of the array
        const n = Math.min(count, arr.length);

        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            result.push(arr[idx]);
            arr.splice(idx, 1);
        }

        return result;
    }

    generate(forestMap: ForestMap, step: number): void {
        // For tree expansion, work on a shuffled copy of the current filled cells.
        const filledCells = forestMap.getFilledCells().shuffle();

        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }

    private growTrees(forestMap: ForestMap, filledCells: CellsList, step: number): void {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }

    private cutTrees(forestMap: ForestMap, filledCells: CellsList): void {

        if (filledCells.length === 0) {
            return;
        }

        filledCells
            .slice(0, Math.floor(filledCells.length * Config.FOREST_DIE_CHANCE))
            .forEach(cell => forestMap.unfill(cell[0], cell[1]));
    }

    private expandTrees(forestMap: ForestMap, filledCells: CellsList, step: number): void {
        const usedSpaceRatio = filledCells.length / this.maxForestCells;
        const growthChance = step <= Config.STEPS_BOOST_STEPS
            ? Config.FOREST_GROWTH_CHANCE * 3
            : Config.FOREST_GROWTH_CHANCE;
        const growthSpeed = growthChance * (1 - usedSpaceRatio);

        if (growthSpeed === 0) {
            return;
        }

        // Build a Set for quick lookup of filled cells.
        const filledSet = new Set(filledCells.map(([x, y]) => `${x},${y}`));

        filledCells.forEach(cell => {
            forestMap.foreachNeighbors(cell[0], cell[1], (x: number, y: number): boolean => {
                if (!filledSet.has(`${x},${y}`)) {
                    const humidity = this.humidityMap.getCell(x, y);
                    const growsChance = this.getCreateChance(forestMap, humidity, x, y, growthSpeed);

                    if (iAmLucky(growsChance)) {
                        forestMap.fill(x, y);
                        filledSet.add(`${x},${y}`); // Update the set so subsequent checks include this cell.
                        return true; // Stop iterating neighbors for this cell.
                    }
                }

                return false;
            }, true);
        });
    }

    private createTrees(forestMap: ForestMap, filledCells: CellsList, step: number): void {
        // Determine the number of new trees to attempt to create.
        const createIntensity = Math.ceil(
            Math.max(this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length))
        );
        // Instead of shuffling all unfilled cells, pick a random subset.
        const unfilledCells = forestMap.getUnfilledCells();
        const potentialCells = this.pickRandomSubset(unfilledCells, createIntensity);

        potentialCells.forEach(([x, y]) => {
            const bornChance = step <= Config.STEPS_BOOST_STEPS
                ? Config.FOREST_BORN_CHANCE * Config.FOREST_BORN_BOOST
                : Config.FOREST_BORN_CHANCE;

            const createChance = this.getCreateChance(
                forestMap,
                this.humidityMap.getCell(x, y),
                x,
                y,
                bornChance
            );

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }

    private getCreateChance(forestMap: ForestMap, humidity: number, x: number, y: number, speed: number): number {
        if (humidity === 0 || this.notAllowedSet.has(`${x},${y}`)) {
            return 0;
        }


        const biome = forestMap.biomes.getCell(x, y);
        if (!biome) {
            return 0;
        }

        const biomeName = biome.getName();
        if (!Object.prototype.hasOwnProperty.call(this.groundCreateMults, biomeName)) {
            return 0;
        }

        const waterMult = Config.FOREST_CREATE_MULTS.WATER;
        const humidityMult = Config.FOREST_CREATE_MULTS.HUMIDITY;
        const waterDistance = biome.getDistanceToWater();
        const waterRatio = Math.max(1, waterMult / waterDistance);
        const humidityRatio = changeRange(humidity, 0, 1, 0, humidityMult);
        const groundRatio = this.groundCreateMults[biomeName];

        return speed * (groundRatio + humidityRatio + waterRatio) * biome.altitude;
    }
}