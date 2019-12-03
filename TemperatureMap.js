class TemperatureMap extends PointMatrix {

    ALTITUDE_TEMPERATURE_FACTOR = 0.7; // [0-1]

    altitudeMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {TemperatureMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldWidth, config.worldHeight);

        this.ALTITUDE_TEMPERATURE_FACTOR = typeof config.ALTITUDE_TEMPERATURE_FACTOR === 'undefined'
            ? this.ALTITUDE_TEMPERATURE_FACTOR
            : config.ALTITUDE_TEMPERATURE_FACTOR;

        this.altitudeMap = altitudeMap;
        this.config = config;

        return this;
    };

    /**
     * @return {TemperatureMap}
     */
    generateMap = function() {

        let _this = this,
            gradient = [],
            revFactor = (1 - _this.ALTITUDE_TEMPERATURE_FACTOR) * 10;

        for(let i = 0; i < this.config.worldHeight; i++) {
            gradient[i] = i / this.config.worldHeight;
        }

        _this.map(function(x, y) {
            return (_this.altitudeMap.getTile(x, y) + gradient[y] * revFactor) / revFactor;
        });

        return _this;
    };
}