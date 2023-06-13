import Matrix from "../structures/Matrix.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import biomes from "../biomes/biomes.js";
import {fromFraction, throwError, logTimeEvent, Filters} from "../helpers.js";

export default class BiomesOperator {

    /** @var {Matrix} */
    biomes;

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {CoastMap} */
    coastMap;

    /** @var {BinaryMatrix} */
    freshWaterMap;

    /** @var {TemperatureMap} */
    temperatureMap;

    /** @var {HumidityMap} */
    humidityMap;

    /** @var {Object} */
    config;

    /** @var {Object} */
    biomesConfig;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Layer} biomesLayer
     * @param {object} config
     */
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer, config) {

        this.biomes = new Matrix(config.WORLD_SIZE, config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.config = config;
        this.biomesConfig = config.biomesConfig();

        let _this = this;

        altitudeMap.foreach(function(x, y) {
            _this.biomes.setCell(x, y, _this._getBiome(x, y));
        });

        if (config.LOGS) {
            logTimeEvent('Biomes calculated');
        }

        this.addBiomesToLayer(biomesLayer);

        this.biomes = Filters.apply('biomes', this.biomes);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} altitude
     * @param {number} temperature
     * @param {number} humidity
     * @return {boolean}
     */
    isBeach(x, y, altitude, temperature, humidity) {
        return altitude > this.config.MAX_COAST_LEVEL
            && altitude <= this.config.MAX_BEACH_LEVEL
            - (temperature * this.config.BEACH_TEMPERATURE_RATIO * 2 - this.config.BEACH_TEMPERATURE_RATIO)
            - (humidity * this.config.BEACH_HUMIDITY_RATIO * 2 - this.config.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, this.config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    /**
     * @internal
     * @param {Array} fig
     * @param {number} index
     * @return {boolean}
     */
    checkBiomeIndex = function(fig, index) {

        if (fig[0] === 0 && index === 0) {
            return true;
        } else if (index > fig[0] && index <= fig[1]) {
            return true;
        }

        return false;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {Biome}
     */
    _getBiome(x, y) {

        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = distanceToWater > 100 ? 100 : distanceToWater;

        let args = {
            altitude: this.altitudeMap.getCell(x, y),
            temperature: this.temperatureMap.getCell(x, y),
            humidity: this.humidityMap.getCell(x, y),
            distanceToWater: distanceToWater,
            config: this.config
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

        let matchedBiomes = [];

        for (let i = 0; i < this.biomesConfig.length; i++) {
            let cfg = this.biomesConfig[i]

            if (
                this.checkBiomeIndex(cfg.h, fromFraction(args.humidity, this.config.MIN_HUMIDITY, this.config.MAX_HUMIDITY))
                && this.checkBiomeIndex(cfg.t, fromFraction(args.temperature, this.config.MIN_TEMPERATURE, this.config.MAX_TEMPERATURE))
                && this.checkBiomeIndex(cfg.a, args.altitude)
            ) {
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

    /**
     * @param {Layer} biomesLayer
     */
    addBiomesToLayer = function(biomesLayer) {
        let _this = this;

        _this.biomes.foreach(function(x, y) {
            biomesLayer.setCell(
                x, y,
                _this.biomes.getCell(x, y).getDisplayCell()
            );
        });
    }

    /**
     * @return {Matrix}
     */
    getBiomes() {
        return this.biomes;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {false|Biome}
     */
    getBiome(x, y) {
        return this.biomes.getCell(x, y);
    }

    /**
     * @param {string} biomeName
     * @returns {BinaryMatrix}
     */
    getSurfaceByBiomeName(biomeName) {

        let biomes = this.biomes,
            surface = new BinaryMatrix(0, this.config.WORLD_SIZE, this.config.WORLD_SIZE);

        this.altitudeMap.foreach(function(x, y) {
            if (biomes.getCell(x, y).getName() === biomeName) {
                surface.fill(x, y);
            }
        });

        return surface;
    }
}