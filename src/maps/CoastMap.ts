import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import OceanMap from "./OceanMap.js";
import AltitudeMap from "./AltitudeMap.js";
import TemperatureMap from "./TemperatureMap.js";

export default class CoastMap extends BinaryMatrix {

    oceanMap: OceanMap;
    altitudeMap: AltitudeMap;
    temperatureMap: TemperatureMap;

    constructor(oceanMap: OceanMap, altitudeMap: AltitudeMap, temperatureMap: TemperatureMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;
    }

    isCoast(altitude: number, temperature: number): boolean {
        return altitude > Config.MAX_OCEAN_LEVEL
            - (temperature * Config.COAST_TEMPERATURE_RATIO * 2 - Config.COAST_TEMPERATURE_RATIO)
            && altitude <= Config.MAX_COAST_LEVEL;
    }

    generateMap(): CoastMap {
        const _this: CoastMap = this;

        _this.oceanMap.foreachFilled(function (x: number, y: number): void {
            if (_this.isCoast(_this.altitudeMap.getCell(x, y), _this.temperatureMap.getCell(x, y))) {
                _this.fill(x, y);
            }
        });

        return _this;
    }
}