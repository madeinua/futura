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

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.config = config;

        return this;
    };

    generateMap = function() {

        let _this = this,
            bigMap = createNoiseMap(_this.config.worldSize, 25),
            smallMap = createNoiseMap(_this.config.worldSize, 5);

        // blend maps
        _this.map(function(x, y) {
            return (bigMap.getTile(x, y) * 2 + smallMap.getTile(x, y) * 0.5) * 0.5;
        });

        return _this;
    };

    getForestType(groundClass, altitude, temperature, humidity) {

        // 1. temp
        // 2. hum
        // 3. nearly forest
        // 4. random

        let forestType;

        if (altitude >= this.config.BOREAL_FOREST_MIN_ALTITUDE) {
            forestType = this.config.FOREST_BOREAL;
        } else if (groundClass === Biome_Tropic) {
            forestType = this.config.FOREST_TROPICAL;
        } else {
            forestType = this.config.FOREST_TEMPERATE;
        }
    }
}