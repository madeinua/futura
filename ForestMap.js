class ForestMap extends BinaryMatrix {

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Object} config
     * @return {ForestMap}
     */
    constructor(altitudeMap, temperatureMap, humidityMap, config) {

        super(config.worldWidth, config.worldHeight);

        let _this = this,
            bigMap = createNoiseMap(config.worldWidth, config.worldHeight, 25),
            smallMap = createNoiseMap(config.worldWidth, config.worldHeight, 5);

        // blend maps
        _this.map(function(x, y) {
            return (bigMap.getTile(x, y) * 2 + smallMap.getTile(x, y) * 0.5) * 0.5;
        });

        return _this;
    };
}