import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
export default class AltitudeMap extends PointMatrix {
    constructor() {
        super(...arguments);
        this.waterSize = 0;
        this.landSize = 0;
        this.generateMap = function () {
            const _this = this, octaves = [3, 5, 20], // [12, 20, 80]
            maps = [];
            for (let i in octaves) {
                maps[i] = new NoiseMapGenerator(Config.WORLD_SIZE, octaves[i] * (Config.WORLD_SIZE / 75)).generate();
            }
            _this.map(function (x, y) {
                let val = 0, size = 0, s;
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
        };
        this.loadMap = function (str) {
            this.fromString(str);
            this.initVariables();
        };
        this.makeIsland = function (x, y, islandSize, altitude) {
            // Circular Distance
            const dx = Math.abs(x - islandSize * 0.5), dy = Math.abs(y - islandSize * 0.5), distance = Math.sqrt(dx * dx + dy * dy), delta = distance / (islandSize * 0.42), gradient = delta * delta - 0.2;
            return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
        };
        this.isGround = function (level) {
            return level > Config.MAX_WATER_LEVEL;
        };
        this.isWater = function (level) {
            return Config.MAX_WATER_LEVEL >= level;
        };
        this.getLandCellsCount = function () {
            return this.landSize;
        };
        this.getWaterCellsCount = function () {
            return this.landSize;
        };
    }
    initVariables() {
        const _this = this;
        _this.foreach(function (x, y) {
            _this.isWater(_this.getCell(x, y))
                ? _this.waterSize++
                : _this.landSize++;
        });
    }
}
