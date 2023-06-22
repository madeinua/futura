import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class CoastMap extends BinaryMatrix {
    constructor(oceanMap, altitudeMap, temperatureMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;
    }
    isCoast(altitude, temperature) {
        return altitude > Config.MAX_OCEAN_LEVEL
            - (temperature * Config.COAST_TEMPERATURE_RATIO * 2 - Config.COAST_TEMPERATURE_RATIO)
            && altitude <= Config.MAX_COAST_LEVEL;
    }
    generateMap() {
        const _this = this;
        _this.oceanMap.foreachFilled(function (x, y) {
            if (_this.isCoast(_this.altitudeMap.getCell(x, y), _this.temperatureMap.getCell(x, y))) {
                _this.fill(x, y);
            }
        });
        return _this;
    }
}
