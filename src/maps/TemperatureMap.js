import PointMatrix from "../structures/PointMatrix.js";

export default class TemperatureMap extends PointMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {Object} */
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {TemperatureMap}
     */
    constructor(altitudeMap, config) {
        super(config.WORLD_SIZE, config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
        this.config = config;
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

        for (let i = 0; i < _this.config.WORLD_SIZE; i++) {
            gradient[i] = i / _this.config.WORLD_SIZE;
        }

        _this.foreach(function(x, y) {
            _this.addToCell(x, y, gradient[y]);
        });
    };

    considerAltitude = function() {
        let _this = this,
            minLevel = _this.config.MAX_COAST_LEVEL,
            altitude;

        _this.foreach(function(x, y) {
            altitude = _this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            _this.subtractFromCell(x, y, altitude);
        });
    };
}