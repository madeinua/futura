import { changeRange, iAmLucky } from "../helpers.js";
import Config from "../../config.js";
export default class ForestGenerator {
    constructor(biomesOperator) {
        this.groundCreateMults = {};
        this.unallowedCells = [];
        this.biomesOperator = biomesOperator;
        this.maxForestCells = Math.ceil(biomesOperator.altitudeMap.getLandCellsCount() * Config.FOREST_LIMIT / 100);
        this.minCreateIntensity = Math.ceil(this.maxForestCells / 10);
        let maxGroundMult = 0;
        for (let i in Config.FOREST_GROUNDS_MULTS) {
            maxGroundMult = Math.max(maxGroundMult, Config.FOREST_GROUNDS_MULTS[i]);
        }
        for (let i in Config.FOREST_GROUNDS_MULTS) {
            this.groundCreateMults[i] = changeRange(Config.FOREST_GROUNDS_MULTS[i], 0, maxGroundMult, 0, Config.FOREST_CREATE_MULTS.GROUND);
        }
        const _this = this;
        biomesOperator.altitudeMap.foreachValues(function (altitude, x, y) {
            if (altitude > Config.MAX_HILLS_LEVEL) {
                _this.unallowedCells.push([x, y]);
            }
        });
    }
    generate(forestMap, step) {
        const filledCells = forestMap.getFilledCells().shuffle();
        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }
    growTrees(forestMap, filledCells, step) {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }
    cutTrees(forestMap, filledCells) {
        if (!filledCells.length) {
            return;
        }
        filledCells
            .slice(0, filledCells.length * Config.FOREST_DIE_CHANCE)
            .forEach(function (cell) {
            forestMap.unfill(cell[0], cell[1]);
        });
    }
    expandTrees(forestMap, filledCells, step) {
        const _this = this, usedSpace = filledCells.length / this.maxForestCells, chance = step <= Config.STEPS_BOOST_STEPS ? Config.FOREST_GROWTH_CHANCE * 3 : Config.FOREST_GROWTH_CHANCE, speed = chance * (1 - usedSpace);
        if (speed === 0) {
            return;
        }
        filledCells.forEach(function (cell) {
            forestMap.foreachNeighbors(cell[0], cell[1], function (x, y) {
                if (!filledCells.includes([x, y])) {
                    const growsChance = _this.getCreateChance(forestMap, _this.biomesOperator.humidityMap.getCell(x, y), x, y, speed);
                    if (iAmLucky(growsChance)) {
                        forestMap.fill(x, y);
                        return true;
                    }
                }
                return false;
            }, true);
        });
    }
    createTrees(forestMap, filledCells, step) {
        const _this = this, createIntensity = Math.ceil(Math.max(_this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length))), potentialCells = forestMap.getUnfilledCells().shuffle().slice(0, createIntensity);
        for (let i = 0; i < potentialCells.length; i++) {
            const x = potentialCells[i][0], y = potentialCells[i][1];
            const createChance = _this.getCreateChance(forestMap, _this.biomesOperator.humidityMap.getCell(x, y), x, y, step <= Config.STEPS_BOOST_STEPS
                ? Config.FOREST_BORN_CHANCE * Config.FOREST_BORN_BOOST
                : Config.FOREST_BORN_CHANCE);
            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        }
    }
    getCreateChance(forestMap, humidity, x, y, speed) {
        if (humidity === 0 || this.unallowedCells.includesCell([x, y])) {
            return 0;
        }
        const biome = forestMap.biomes.getCell(x, y);
        if (!this.groundCreateMults.hasOwnProperty(biome.getName())) {
            return 0;
        }
        const waterRatio = Math.max(1, Config.FOREST_CREATE_MULTS.WATTER / biome.getDistanceToWater()), humidityRatio = changeRange(humidity, 0, 1, 0, Config.FOREST_CREATE_MULTS.HUMIDITY), groundRatio = this.groundCreateMults[biome.getName()];
        return speed * (groundRatio + humidityRatio + waterRatio);
    }
}
