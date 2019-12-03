class ForestMap extends BinaryMatrix {

    altitudeMap;
    temperatureMap;
    humidityMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Object} config
     * @return {ForestMap}
     */
    constructor(altitudeMap, temperatureMap, humidityMap, config) {

        super(config.worldWidth, config.worldHeight);

        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.config = config;

        return this;
    };

    generateMap = function() {

        let _this = this,
            bigMap = createNoiseMap(_this.config.worldWidth, _this.config.worldHeight, 25),
            smallMap = createNoiseMap(_this.config.worldWidth, _this.config.worldHeight, 5);

        // blend maps
        _this.map(function(x, y) {
            return (bigMap.getTile(x, y) * 2 + smallMap.getTile(x, y) * 0.5) * 0.5;
        });

        return _this;
    };
}