class TemperatureMap extends PointMatrix {

    ALTITUDE_TEMPERATURE_FACTOR = 0.7; // [0-1]

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {TemperatureMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldWidth, config.worldHeight);

        let _this = this;

        _this.ALTITUDE_TEMPERATURE_FACTOR = typeof config.ALTITUDE_TEMPERATURE_FACTOR === 'undefined'
            ? _this.ALTITUDE_TEMPERATURE_FACTOR
            : config.ALTITUDE_TEMPERATURE_FACTOR;

        let gradient = [],
            revFactor = (1 - _this.ALTITUDE_TEMPERATURE_FACTOR) * 10;

        for(let i = 0; i < config.worldHeight; i++) {
            gradient[i] = i / config.worldHeight;
        }

        _this.map(function(x, y) {
            return (altitudeMap.getTile(x, y) + gradient[y] * revFactor) / revFactor;
        });

        return _this;
    };
}