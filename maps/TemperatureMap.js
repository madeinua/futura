class TemperatureMap extends PointMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    constructor(altitudeMap) {
        super();

        this.altitudeMap = altitudeMap;
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
            _this.addToCell(x, y, gradient[y]);
        });
    };

    considerAltitude = function() {
        let _this = this,
            minLevel = config.MAX_COAST_LEVEL,
            altitude;

        _this.foreach(function(x, y) {
            altitude = _this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            _this.subtractFromCell(x, y, altitude);
        });
    };
}