import { changeRange, iAmLucky } from "../helpers.js";
import Config from "../../config.js";
export default class ForestGenerator {
    constructor(altitudeMap, humidityMap) {
        this.groundCreateMults = {};
        this.notAllowedCells = [];
        this.notAllowedSet = new Set();
        this.altitudeMap = altitudeMap;
        this.humidityMap = humidityMap;
        this.maxForestCells = Math.ceil(altitudeMap.getLandCellsCount() * Config.FOREST_LIMIT / 100);
        this.minCreateIntensity = Math.ceil(this.maxForestCells / 10);
        this.initializeGroundCreateMults();
        this.setNotAllowedCells();
    }
    initializeGroundCreateMults() {
        const maxGroundMult = Math.max(...Object.values(Config.FOREST_GROUNDS_MULTS).map(v => v !== null && v !== void 0 ? v : 0));
        for (const [key, value] of Object.entries(Config.FOREST_GROUNDS_MULTS)) {
            this.groundCreateMults[key] = changeRange(value !== null && value !== void 0 ? value : 0, 0, maxGroundMult, 0, Config.FOREST_CREATE_MULTS.GROUND);
        }
    }
    setNotAllowedCells() {
        this.altitudeMap.foreachValues((altitude, x, y) => {
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
    pickRandomSubset(array, count) {
        const result = [];
        const arr = array.slice(); // copy of the array
        const n = Math.min(count, arr.length);
        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            result.push(arr[idx]);
            arr.splice(idx, 1);
        }
        return result;
    }
    generate(forestMap, step) {
        // For tree expansion, work on a shuffled copy of the current filled cells.
        const filledCells = forestMap.getFilledCells().shuffle();
        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }
    growTrees(forestMap, filledCells, step) {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }
    cutTrees(forestMap, filledCells) {
        if (filledCells.length === 0) {
            return;
        }
        filledCells
            .slice(0, Math.floor(filledCells.length * Config.FOREST_DIE_CHANCE))
            .forEach(cell => forestMap.unfill(cell[0], cell[1]));
    }
    expandTrees(forestMap, filledCells, step) {
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
            forestMap.foreachNeighbors(cell[0], cell[1], (x, y) => {
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
    createTrees(forestMap, filledCells, step) {
        // Determine the number of new trees to attempt to create.
        const createIntensity = Math.ceil(Math.max(this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length)));
        // Instead of shuffling all unfilled cells, pick a random subset.
        const unfilledCells = forestMap.getUnfilledCells();
        const potentialCells = this.pickRandomSubset(unfilledCells, createIntensity);
        potentialCells.forEach(([x, y]) => {
            const bornChance = step <= Config.STEPS_BOOST_STEPS
                ? Config.FOREST_BORN_CHANCE * Config.FOREST_BORN_BOOST
                : Config.FOREST_BORN_CHANCE;
            const createChance = this.getCreateChance(forestMap, this.humidityMap.getCell(x, y), x, y, bornChance);
            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }
    getCreateChance(forestMap, humidity, x, y, speed) {
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
