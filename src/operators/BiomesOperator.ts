import BinaryMatrix from "../structures/BinaryMatrix.js";
import biomes from "../biomes/Biomes.js";
import {Cell} from "../structures/Cells.js";
import {fromFraction, throwError, logTimeEvent, Filters} from "../helpers.js";
import Config from "../../config.js";
import AltitudeMap from "../maps/AltitudeMap.js";
import CoastMap from "../maps/CoastMap.js";
import TemperatureMap from "../maps/TemperatureMap.js";
import HumidityMap from "../maps/HumidityMap.js";
import OceanMap from "../maps/OceanMap.js";
import {Layer} from "../render/Layer.js";
import Biome, {BiomeArgs} from "../biomes/Biome.js"
import BiomesMap from "../maps/BiomesMap.js";

type biomesConfig = {
    class: string,
    h: [number, number],
    t: [number, number],
}[];

export default class BiomesOperator {

    readonly biomes: BiomesMap;
    readonly altitudeMap: AltitudeMap;
    readonly coastMap: CoastMap;
    readonly oceanMap: OceanMap;
    readonly freshWaterMap: BinaryMatrix;
    readonly temperatureMap: TemperatureMap;
    readonly humidityMap: HumidityMap;
    readonly biomesConfig: biomesConfig;

    constructor(
        altitudeMap: AltitudeMap,
        oceanMap: OceanMap,
        coastMap: CoastMap,
        freshWaterMap: BinaryMatrix,
        temperatureMap: TemperatureMap,
        humidityMap: HumidityMap,
        biomesLayer: Layer,
        biomesImagesLayer: Layer,
    ) {

        this.biomes = new BiomesMap();
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = Config.biomesConfig();

        this.createBiomes(altitudeMap);
        this.addBiomesToLayer(biomesLayer, biomesImagesLayer);

        this.biomes = Filters.apply('biomes', this.biomes);

        if (Config.LOGS) {
            logTimeEvent('Biomes added');
        }
    }

    private createBiomes = function (altitudeMap: AltitudeMap): void {
        const _this: BiomesOperator = this;

        altitudeMap.foreach(function (x: number, y: number): void {
            _this.biomes.setCell(x, y, _this._getBiome(x, y));
        });
    }

    isBeach(x: number, y: number, altitude: number, temperature: number, humidity: number): boolean {
        return altitude > Config.MIN_GROUND_LEVEL
            && altitude <= Config.MAX_BEACH_LEVEL
            - (temperature * Config.BEACH_TEMPERATURE_RATIO * 2 - Config.BEACH_TEMPERATURE_RATIO)
            - (humidity * Config.BEACH_HUMIDITY_RATIO * 2 - Config.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, Config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    private _checkBiomeIndex = function (fig: Cell, index: number): boolean {

        if (fig[0] === 0 && index === 0) {
            return true;
        } else if (index > fig[0] && index <= fig[1]) {
            return true;
        }

        return false;
    }

    private _getBiome(x: number, y: number): Biome {

        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = distanceToWater > 100 ? 100 : distanceToWater;

        const altitude = this.altitudeMap.getCell(x, y),
            args: BiomeArgs = {
                altitude: altitude,
                temperature: this.temperatureMap.getCell(x, y),
                humidity: this.humidityMap.getCell(x, y),
                distanceToWater: distanceToWater,
                isHills: this.altitudeMap.isHills(altitude),
                isMountains: this.altitudeMap.isMountains(altitude),
            }

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

        const matchedBiomes: string[] = [];

        for (let i = 0; i < this.biomesConfig.length; i++) {
            const cfg = this.biomesConfig[i];

            if (
                this._checkBiomeIndex(cfg.h, fromFraction(args.humidity, Config.MIN_HUMIDITY, Config.MAX_HUMIDITY))
                && this._checkBiomeIndex(cfg.t, fromFraction(args.temperature, Config.MIN_TEMPERATURE, Config.MAX_TEMPERATURE))
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

    private addBiomesToLayer = function (biomesLayer: Layer, biomesImagesLayer: Layer): void {
        this.biomes.foreachValues(function (biome: Biome, x: number, y: number): void {
            biomesLayer.setCell(x, y, biome.getDisplayCell());

            if (biome.hasImage()) {
                biomesImagesLayer.setCell(x, y, biome.getDisplayCell());
            }
        });
    }

    getBiomes(): BiomesMap {
        return this.biomes;
    }

    getBiome(x: number, y: number): null | Biome {
        return this.biomes.getCell(x, y);
    }

    getSurfaceByBiomeName(biomeName: string): BinaryMatrix {

        const biomes = this.biomes,
            surface = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.altitudeMap.foreach(function (x: number, y: number): void {
            if (biomes.getCell(x, y).getName() === biomeName) {
                surface.fill(x, y);
            }
        });

        return surface;
    }
}