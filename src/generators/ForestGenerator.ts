import {arrayHasPoint, changeRange, iAmLucky} from "../helpers.js";
import Config from "../../config.js";
import {CellsList} from "../structures/Cells.js";
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

        this.initializeGroundCreateMults();
        this.setNotAllowedCells();
    }

    private initializeGroundCreateMults(): void {
        const maxGroundMult = Math.max(...Object.values(Config.FOREST_GROUNDS_MULTS).map(v => v ?? 0));

        for (const [key, value] of Object.entries(Config.FOREST_GROUNDS_MULTS)) {
            this.groundCreateMults[key] = changeRange(value ?? 0, 0, maxGroundMult, 0, Config.FOREST_CREATE_MULTS.GROUND);
        }
    }

    private setNotAllowedCells(): void {
        this.altitudeMap.foreachValues((altitude: number, x: number, y: number): void => {
            if (altitude > Config.MAX_HILLS_LEVEL) {
                this.notAllowedCells.push([x, y]);
            }
        });
    }

    generate(forestMap: ForestMap, step: number): void {
        const filledCells = forestMap.getFilledCells().shuffle();

        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }

    private growTrees(forestMap: ForestMap, filledCells: CellsList, step: number): void {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }

    private cutTrees(forestMap: ForestMap, filledCells: CellsList): void {
        if (filledCells.length === 0) return;

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

        if (growthSpeed === 0) return;

        filledCells.forEach(cell => {
            forestMap.foreachNeighbors(cell[0], cell[1], (x: number, y: number): boolean => {
                if (!arrayHasPoint(filledCells, x, y)) {
                    const growsChance = this.getCreateChance(forestMap, this.humidityMap.getCell(x, y), x, y, growthSpeed);
                    if (iAmLucky(growsChance)) {
                        forestMap.fill(x, y);
                        return true;
                    }
                }
                return false;
            }, true);
        });
    }

    private createTrees(forestMap: ForestMap, filledCells: CellsList, step: number): void {
        const createIntensity = Math.ceil(Math.max(this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length)));
        const potentialCells = forestMap.getUnfilledCells().shuffle().slice(0, createIntensity);

        potentialCells.forEach(([x, y]) => {
            const createChance = this.getCreateChance(
                forestMap,
                this.humidityMap.getCell(x, y),
                x,
                y,
                step <= Config.STEPS_BOOST_STEPS
                    ? Config.FOREST_BORN_CHANCE * Config.FOREST_BORN_BOOST
                    : Config.FOREST_BORN_CHANCE
            );

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }

    private getCreateChance(forestMap: ForestMap, humidity: number, x: number, y: number, speed: number): number {
        if (humidity === 0 || this.notAllowedCells.includesCell([x, y])) {
            return 0;
        }

        const biome = forestMap.biomes.getCell(x, y);

        if (!biome || !this.groundCreateMults.hasOwnProperty(biome.getName())) {
            return 0;
        }

        const waterRatio = Math.max(1, Config.FOREST_CREATE_MULTS.WATER / biome.getDistanceToWater());
        const humidityRatio = changeRange(humidity, 0, 1, 0, Config.FOREST_CREATE_MULTS.HUMIDITY);
        const groundRatio = this.groundCreateMults[biome.getName()];

        return speed * (groundRatio + humidityRatio + waterRatio) * biome.altitude;
    }
}