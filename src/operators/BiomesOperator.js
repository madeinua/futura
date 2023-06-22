import Matrix from "../structures/Matrix.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import biomes from "../biomes/biomes.js";
import { fromFraction, throwError, logTimeEvent, Filters } from "../helpers.js";
import Config from "../../config.js";
export default class BiomesOperator {
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer) {
        this._checkBiomeIndex = function (fig, index) {
            if (fig[0] === 0 && index === 0) {
                return true;
            }
            else if (index > fig[0] && index <= fig[1]) {
                return true;
            }
            return false;
        };
        this.addBiomesToLayer = function (biomesLayer) {
            const _this = this;
            _this.biomes.foreach(function (x, y) {
                biomesLayer.setCell(x, y, _this.biomes.getCell(x, y).getDisplayCell());
            });
        };
        this.biomes = new Matrix(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = Config.biomesConfig();
        const _this = this;
        altitudeMap.foreach(function (x, y) {
            _this.biomes.setCell(x, y, _this._getBiome(x, y));
        });
        if (Config.LOGS) {
            logTimeEvent('Biomes calculated');
        }
        this.addBiomesToLayer(biomesLayer);
        this.biomes = Filters.apply('biomes', this.biomes);
    }
    isBeach(x, y, altitude, temperature, humidity) {
        return altitude > Config.MAX_COAST_LEVEL
            && altitude <= Config.MAX_BEACH_LEVEL
                - (temperature * Config.BEACH_TEMPERATURE_RATIO * 2 - Config.BEACH_TEMPERATURE_RATIO)
                - (humidity * Config.BEACH_HUMIDITY_RATIO * 2 - Config.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, Config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }
    _getBiome(x, y) {
        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = distanceToWater > 100 ? 100 : distanceToWater;
        const args = {
            altitude: this.altitudeMap.getCell(x, y),
            temperature: this.temperatureMap.getCell(x, y),
            humidity: this.humidityMap.getCell(x, y),
            distanceToWater: distanceToWater
        };
        if (this.freshWaterMap.filled(x, y)) {
            return new biomes.Biome_Water(x, y, args);
        }
        if (this.oceanMap.filled(x, y)) {
            return this.coastMap.isCoast(args.altitude, args.temperature)
                ? new biomes.Biome_Coast(x, y, args)
                : new biomes.Biome_Ocean(x, y, args);
        }
        if (this.isBeach(x, y, args.altitude, args.temperature, args.humidity)) {
            return new biomes.Biome_Beach(x, y, args);
        }
        const matchedBiomes = [];
        for (let i = 0; i < this.biomesConfig.length; i++) {
            const cfg = this.biomesConfig[i];
            if (this._checkBiomeIndex(cfg.h, fromFraction(args.humidity, Config.MIN_HUMIDITY, Config.MAX_HUMIDITY))
                && this._checkBiomeIndex(cfg.t, fromFraction(args.temperature, Config.MIN_TEMPERATURE, Config.MAX_TEMPERATURE))
                && this._checkBiomeIndex(cfg.a, args.altitude)) {
                matchedBiomes.push(cfg.class);
            }
        }
        if (!matchedBiomes.length) {
            throwError('No biome matched for ' + x + ', ' + y, 2, true);
            throwError(args, 2, true);
        }
        return matchedBiomes.length
            ? new biomes[matchedBiomes.randomElement()](x, y, args)
            : new biomes.Biome_Grass(x, y, args);
    }
    getBiomes() {
        return this.biomes;
    }
    getBiome(x, y) {
        return this.biomes.getCell(x, y);
    }
    getSurfaceByBiomeName(biomeName) {
        const biomes = this.biomes, surface = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.altitudeMap.foreach(function (x, y) {
            if (biomes.getCell(x, y).getName() === biomeName) {
                surface.fill(x, y);
            }
        });
        return surface;
    }
}
