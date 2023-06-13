import BinaryMatrix from "../structures/BinaryMatrix.js";

export default class CoastMap extends BinaryMatrix {

    /** @var {OceanMap} */
    oceanMap;

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {TemperatureMap} */
    temperatureMap;

    /** @var {Object} */
    config;

    /**
     * @param {OceanMap} oceanMap
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {Object} config
     * @return {CoastMap}
     */
    constructor(oceanMap, altitudeMap, temperatureMap, config) {
        super(0, config.WORLD_SIZE, config.WORLD_SIZE);

        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;
        this.config = config;
    };

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @return {boolean}
     */
    isCoast(altitude, temperature) {
        return altitude > this.config.MAX_OCEAN_LEVEL
            - (temperature * this.config.COAST_TEMPERATURE_RATIO * 2 - this.config.COAST_TEMPERATURE_RATIO)
            && altitude <= this.config.MAX_COAST_LEVEL;
    }

    /**
     * @return {CoastMap}
     */
    generateMap() {

        let _this = this;

        _this.oceanMap.foreachFilled(function(x, y) {
            if (_this.isCoast(_this.altitudeMap.getCell(x, y), _this.temperatureMap.getCell(x, y))) {
                _this.fill(x, y);
            }
        });

        return _this;
    }
}