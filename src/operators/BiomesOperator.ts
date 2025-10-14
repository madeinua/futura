import Config, {BiomeHTConfig} from "../../config";
import BinaryMatrix from "../structures/BinaryMatrix";
import biomes from "../biomes/Biomes";
import {Cell} from "../structures/Cells";
import {fromFraction, throwError, logTimeEvent, Filters} from "../helpers";
import AltitudeMap from "../maps/AltitudeMap";
import CoastMap from "../maps/CoastMap";
import TemperatureMap from "../maps/TemperatureMap";
import HumidityMap from "../maps/HumidityMap";
import OceanMap from "../maps/OceanMap";
import {Layer} from "../render/Layer";
import Biome, {BiomeArgs} from "../biomes/Biome";
import BiomesMap from "../maps/BiomesMap";

export default class BiomesOperator {

    readonly biomes: BiomesMap;
    readonly altitudeMap: AltitudeMap;
    readonly coastMap: CoastMap;
    readonly oceanMap: OceanMap;
    readonly freshWaterMap: BinaryMatrix;
    readonly temperatureMap: TemperatureMap;
    readonly humidityMap: HumidityMap;
    readonly biomeHTConfigs: BiomeHTConfig[];

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
        this.biomeHTConfigs = Config.biomeHTConfigs();

        this.createBiomes();
        this.addBiomesToLayer(biomesLayer, biomesImagesLayer);

        this.biomes = Filters.apply('biomes', this.biomes);

        if (Config.LOGS) {
            logTimeEvent('Biomes added');
        }
    }

    private createBiomes(): void {
        this.altitudeMap.foreach((x: number, y: number): void => {
            this.biomes.setCell(x, y, this._getBiome(x, y));
        });
    }

    private isBeach(x: number, y: number, altitude: number, temperature: number, humidity: number): boolean {
        return altitude > Config.MIN_GROUND_LEVEL &&
            altitude <= Config.MAX_BEACH_LEVEL -
            (temperature * Config.BEACH_TEMPERATURE_RATIO * 2 - Config.BEACH_TEMPERATURE_RATIO) -
            (humidity * Config.BEACH_HUMIDITY_RATIO * 2 - Config.BEACH_HUMIDITY_RATIO) &&
            this.oceanMap.aroundFilled(x, y, Config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    private _checkBiomeIndex(fig: Cell, index: number): boolean {
        return (fig[0] === 0 && index === 0) || (index > fig[0] && index <= fig[1]);
    }

    private _getBiome(x: number, y: number): Biome {
        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = Math.min(distanceToWater, 100);

        const altitude = this.altitudeMap.getCell(x, y);
        const args: BiomeArgs = {
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

        const matchedBiomes = this.biomeHTConfigs
            .filter(cfg =>
                this._checkBiomeIndex(cfg.h, fromFraction(args.humidity, Config.MIN_HUMIDITY, Config.MAX_HUMIDITY)) &&
                this._checkBiomeIndex(cfg.t, fromFraction(args.temperature, Config.MIN_TEMPERATURE, Config.MAX_TEMPERATURE))
            )
            .map(cfg => cfg.class);

        if (!matchedBiomes.length) {
            throwError(`No biome matched for ${x}, ${y}`, 2, true);
            throwError(args, 2, true);
            return new biomes.Biome_Grass(x, y, args);
        }

        const name = matchedBiomes[Math.floor(Math.random() * matchedBiomes.length)];

        return new biomes[name](x, y, args);
    }

    private addBiomesToLayer(biomesLayer: Layer, biomesImagesLayer: Layer): void {
        this.biomes.foreachValues((biome: Biome, x: number, y: number): void => {
            const displayCell = biome.getDisplayCell();
            biomesLayer.setCell(x, y, displayCell);
            biomesImagesLayer.setCell(x, y, displayCell);
        });
    }

    getBiomes(): BiomesMap {
        return this.biomes;
    }

    getBiome(x: number, y: number): Biome | null {
        return this.biomes.getCell(x, y);
    }

    getSurfaceByBiomeName(biomeName: string): BinaryMatrix {
        const surface = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap.foreach((x: number, y: number): void => {
            if (this.biomes.getCell(x, y)?.getName() === biomeName) {
                surface.fill(x, y);
            }
        });
        return surface;
    }
}