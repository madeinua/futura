class TemperatureMap extends PointMatrix {

    altitudeMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {TemperatureMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.config = config;

        return this;
    };

    /**
     * @return {TemperatureMap}
     */
    generateMap = function() {

        this.addGradient();
        this.considerAltitude();
        this.normalize();

        return this;
    };

    addGradient = function() {

        let _this = this,
            gradient = [];

        for (let i = 0; i < this.config.worldSize; i++) {
            gradient[i] = i / this.config.worldSize;
        }

        _this.foreach(function(x, y) {
            _this.addToTile(x, y, gradient[y]);
        });
    };

    considerAltitude = function() {

        let _this = this,
            revFactor = fromFraction(_this.config.ALTITUDE_TEMPERATURE_FACTOR, 5, 1);

        _this.foreach(function(x, y) {
            _this.addToTile(x, y, _this.altitudeMap.getTile(x, y) / revFactor);
        });
    };
}