import {changeRange, iAmLucky} from "../helpers.js";
import Config from "../../config.js";
import {Cell, CellsList} from "../structures/Cells.js";
import ForestMap from "../maps/ForestMap.js";
import AltitudeMap from "../maps/AltitudeMap.js";
import HumidityMap from "../maps/HumidityMap.js";

type ForestGeneratorMults = {
    [key: string]: number;
}

export default class ForestGenerator {

    readonly altitudeMap: AltitudeMap;
    readonly humidityMap: HumidityMap;
    readonly maxForestCells: number;
    readonly groundCreateMults: ForestGeneratorMults = {};
    readonly notAllowedCells: CellsList = [];
    readonly minCreateIntensity: number;

    constructor(altitudeMap: AltitudeMap, humidityMap: HumidityMap) {

        this.altitudeMap = altitudeMap;
        this.humidityMap = humidityMap;
        this.maxForestCells = Math.ceil(altitudeMap.getLandCellsCount() * Config.FOREST_LIMIT / 100);
        this.minCreateIntensity = Math.ceil(this.maxForestCells / 10);

        let maxGroundMult = 0;

        for (let i in Config.FOREST_GROUNDS_MULTS) {
            maxGroundMult = Math.max(maxGroundMult, Config.FOREST_GROUNDS_MULTS[i]);
        }

        for (let i in Config.FOREST_GROUNDS_MULTS) {
            this.groundCreateMults[i] = changeRange(Config.FOREST_GROUNDS_MULTS[i], 0, maxGroundMult, 0, Config.FOREST_CREATE_MULTS.GROUND);
        }

        const _this: ForestGenerator = this;

        altitudeMap.foreachValues(function (altitude: number, x: number, y: number): void {
            if (altitude > Config.MAX_HILLS_LEVEL) {
                _this.notAllowedCells.push([x, y]);
            }
        });
    }

    generate(forestMap: ForestMap, step: number) {
        const filledCells = forestMap.getFilledCells().shuffle();

        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }

    private growTrees(forestMap: ForestMap, filledCells: CellsList, step: number) {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }

    private cutTrees(forestMap: ForestMap, filledCells: CellsList) {

        if (!filledCells.length) {
            return;
        }

        filledCells
            .slice(0, filledCells.length * Config.FOREST_DIE_CHANCE)
            .forEach(function (cell: Cell): void {
                forestMap.unfill(cell[0], cell[1]);
            });
    }

    private expandTrees(forestMap: ForestMap, filledCells: CellsList, step: number) {

        const _this: ForestGenerator = this,
            usedSpace = filledCells.length / this.maxForestCells,
            chance = step <= Config.STEPS_BOOST_STEPS ? Config.FOREST_GROWTH_CHANCE * 3 : Config.FOREST_GROWTH_CHANCE,
            speed = chance * (1 - usedSpace);

        if (speed === 0) {
            return;
        }

        filledCells.forEach(function (cell: Cell): void {
            forestMap.foreachNeighbors(cell[0], cell[1], function (x: number, y: number): boolean {
                if (!filledCells.includes([x, y])) {

                    const growsChance = _this.getCreateChance(
                        forestMap,
                        _this.humidityMap.getCell(x, y),
                        x,
                        y,
                        speed
                    );

                    if (iAmLucky(growsChance)) {
                        forestMap.fill(x, y);
                        return true;
                    }
                }

                return false;
            }, true);
        });
    }

    private createTrees(forestMap: ForestMap, filledCells: CellsList, step: number) {

        const _this: ForestGenerator = this,
            createIntensity = Math.ceil(Math.max(_this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length))),
            potentialCells = forestMap.getUnfilledCells().shuffle().slice(0, createIntensity);

        for (let i = 0; i < potentialCells.length; i++) {
            const x = potentialCells[i][0],
                y = potentialCells[i][1];

            const createChance = _this.getCreateChance(
                forestMap,
                _this.humidityMap.getCell(x, y),
                x,
                y,
                step <= Config.STEPS_BOOST_STEPS
                    ? Config.FOREST_BORN_CHANCE * Config.FOREST_BORN_BOOST
                    : Config.FOREST_BORN_CHANCE
            );

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        }
    }

    private getCreateChance(forestMap: ForestMap, humidity: number, x: number, y: number, speed: number): number {

        if (humidity === 0 || this.notAllowedCells.includesCell([x, y])) {
            return 0;
        }

        const biome = forestMap.biomes.getCell(x, y);

        if (!this.groundCreateMults.hasOwnProperty(biome.getName())) {
            return 0;
        }

        const waterRatio = Math.max(1, Config.FOREST_CREATE_MULTS.WATTER / biome.getDistanceToWater()),
            humidityRatio = changeRange(humidity, 0, 1, 0, Config.FOREST_CREATE_MULTS.HUMIDITY),
            groundRatio = this.groundCreateMults[biome.getName()];

        return speed * (groundRatio + humidityRatio + waterRatio);
    }
}