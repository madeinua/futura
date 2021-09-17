class CoastMap extends BinaryMatrix {

    /** @var {OceanMap} */
    oceanMap;

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {TemperatureMap} */
    temperatureMap;

    /**
     * @param {OceanMap} oceanMap
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @return {CoastMap}
     */
    constructor(oceanMap, altitudeMap, temperatureMap) {

        super(config.WORLD_SIZE, config.WORLD_SIZE);

        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;

        return this;
    };

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @return {boolean}
     */
    isCoast(altitude, temperature) {
        return altitude > config.MAX_OCEAN_LEVEL
            - (temperature * config.COAST_TEMPERATURE_RATIO * 2 - config.COAST_TEMPERATURE_RATIO)
            && altitude <= config.MAX_COAST_LEVEL;
    }

    /**
     * @return {CoastMap}
     */
    generateMap() {

        let _this = this;

        _this.oceanMap.foreachFilled(function(x, y) {
            if (_this.isCoast(_this.altitudeMap.getTile(x, y), _this.temperatureMap.getTile(x, y))) {
                _this.fill(x, y);
            }
        });

        return _this;
    }
}