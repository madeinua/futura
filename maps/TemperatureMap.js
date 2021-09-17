class TemperatureMap extends PointMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    constructor(altitudeMap) {
        super(config.WORLD_SIZE, config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
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

        for (let i = 0; i < config.WORLD_SIZE; i++) {
            gradient[i] = i / config.WORLD_SIZE;
        }

        _this.foreach(function(x, y) {
            _this.addToTile(x, y, gradient[y]);
        });
    };

    considerAltitude = function() {

        let _this = this,
            revFactor = fromFraction(config.ALTITUDE_TEMPERATURE_FACTOR, 5, 1);

        _this.foreach(function(x, y) {
            _this.addToTile(x, y, _this.altitudeMap.getTile(x, y) / revFactor);
        });
    };
}