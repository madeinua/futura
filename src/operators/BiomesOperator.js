import BinaryMatrix from "../structures/BinaryMatrix.js";
import biomes from "../biomes/Biomes.js";
import { fromFraction, throwError, logTimeEvent, Filters } from "../helpers.js";
import Config from "../../config.js";
import BiomesMap from "../maps/BiomesMap.js";
export default class BiomesOperator {
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer, biomesImagesLayer) {
        this.biomes = new BiomesMap();
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = Config.biomesConfig();
        this.createBiomes();
        this.addBiomesToLayer(biomesLayer, biomesImagesLayer);
        this.biomes = Filters.apply('biomes', this.biomes);
        if (Config.LOGS) {
            logTimeEvent('Biomes added');
        }
    }
    createBiomes() {
        this.altitudeMap.foreach((x, y) => {
            this.biomes.setCell(x, y, this._getBiome(x, y));
        });
    }
    isBeach(x, y, altitude, temperature, humidity) {
        return altitude > Config.MIN_GROUND_LEVEL &&
            altitude <= Config.MAX_BEACH_LEVEL -
                (temperature * Config.BEACH_TEMPERATURE_RATIO * 2 - Config.BEACH_TEMPERATURE_RATIO) -
                (humidity * Config.BEACH_HUMIDITY_RATIO * 2 - Config.BEACH_HUMIDITY_RATIO) &&
            this.oceanMap.aroundFilled(x, y, Config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }
    _checkBiomeIndex(fig, index) {
        return (fig[0] === 0 && index === 0) || (index > fig[0] && index <= fig[1]);
    }
    _getBiome(x, y) {
        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = Math.min(distanceToWater, 100);
        const altitude = this.altitudeMap.getCell(x, y);
        const args = {
            altitude,
            temperature: this.temperatureMap.getCell(x, y),
            humidity: this.humidityMap.getCell(x, y),
            distanceToWater,
            isHills: this.altitudeMap.isHills(altitude),
            isMountains: this.altitudeMap.isMountains(altitude),
        };
        if (this.freshWaterMap.filled(x, y)) {
            return new biomes.Biome_Water(x, y, args);
        }
        if (this.oceanMap.filled(x, y)) {
            return this.coastMap.isCoast(args.altitude)
                ? new biomes.Biome_Coast(x, y, args)
                : new biomes.Biome_Ocean(x, y, args);
        }
        if (this.isBeach(x, y, args.altitude, args.temperature, args.humidity)) {
            return new biomes.Biome_Beach(x, y, args);
        }
        const matchedBiomes = this.biomesConfig
            .filter(cfg => this._checkBiomeIndex(cfg.h, fromFraction(args.humidity, Config.MIN_HUMIDITY, Config.MAX_HUMIDITY)) &&
            this._checkBiomeIndex(cfg.t, fromFraction(args.temperature, Config.MIN_TEMPERATURE, Config.MAX_TEMPERATURE)))
            .map(cfg => cfg.class);
        if (!matchedBiomes.length) {
            throwError(`No biome matched for ${x}, ${y}`, 2, true);
            throwError(args, 2, true);
            return new biomes.Biome_Grass(x, y, args);
        }
        return new biomes[matchedBiomes[Math.floor(Math.random() * matchedBiomes.length)]](x, y, args);
    }
    addBiomesToLayer(biomesLayer, biomesImagesLayer) {
        this.biomes.foreachValues((biome, x, y) => {
            const displayCell = biome.getDisplayCell();
            biomesLayer.setCell(x, y, displayCell);
            biomesImagesLayer.setCell(x, y, displayCell);
        });
    }
    getBiomes() {
        return this.biomes;
    }
    getBiome(x, y) {
        return this.biomes.getCell(x, y);
    }
    getSurfaceByBiomeName(biomeName) {
        const surface = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap.foreach((x, y) => {
            var _a;
            if (((_a = this.biomes.getCell(x, y)) === null || _a === void 0 ? void 0 : _a.getName()) === biomeName) {
                surface.fill(x, y);
            }
        });
        return surface;
    }
}
