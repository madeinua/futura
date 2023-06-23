import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";

export default class AltitudeMap extends PointMatrix {

    waterSize: number = 0;
    landSize: number = 0;

    generateMap = function (): void {

        const _this: AltitudeMap = this,
            octaves = [3, 5, 20], // [12, 20, 80]
            maps = [];

        for (let i in octaves) {
            maps[i] = new NoiseMapGenerator(
                Config.WORLD_SIZE,
                octaves[i] * (Config.WORLD_SIZE / 75)
            ).generate();
        }

        _this.map(function (x: number, y: number): number {

            let val = 0,
                size = 0,
                s;

            // blend maps
            for (let i = 0; i < maps.length; i++) {
                s = Math.pow(2, i);
                size += s;
                val += maps[i].getCell(x, y) * s;
            }

            val /= size;

            // stretch map
            val = Math.min(1, Math.pow(val, Config.WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = _this.makeIsland(x, y, Config.WORLD_SIZE, val);

            // round to 2 decimals
            val = Math.round(val * 100) / 100;

            return val;
        });

        this.initVariables();
    }

    loadMap = function (str: string): void {
        this.fromString(str);
        this.initVariables();
    }

    initVariables() {
        const _this: AltitudeMap = this;

        _this.foreach(function (x: number, y: number): void {
            _this.isWater(_this.getCell(x, y))
                ? _this.waterSize++
                : _this.landSize++;
        });
    }

    makeIsland = function (x: number, y: number, islandSize: number, altitude: number): number {

        // Circular Distance
        const dx = Math.abs(x - islandSize * 0.5),
            dy = Math.abs(y - islandSize * 0.5),
            distance = Math.sqrt(dx * dx + dy * dy),
            delta = distance / (islandSize * 0.42),
            gradient = delta * delta - 0.2;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    }

    isGround = function (level: number): boolean {
        return level > Config.MAX_WATER_LEVEL;
    }

    isWater = function (level: number): boolean {
        return Config.MAX_WATER_LEVEL >= level;
    }

    getLandCellsCount = function (): number {
        return this.landSize;
    }

    getWaterCellsCount = function (): number {
        return this.landSize;
    }
}