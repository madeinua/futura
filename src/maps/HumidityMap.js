import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";

export default class HumidityMap extends PointMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {RiversMap} */
    riversMap;

    /** @var {LakesMap} */
    lakesMap;

    /** @var {Object} */
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {Object} config
     * @return {HumidityMap}
     */
    constructor(altitudeMap, riversMap, lakesMap, config) {
        super(config.WORLD_SIZE, config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
        this.config = config;
    };

    /**
     * 0 = wet
     * 1 = dry
     * @return {HumidityMap}
     */
    generateMap = function() {

        this.generateNoiseMap();
        this.considerAltitude();
        this.considerRivers();
        this.considerLakes();
        this.normalize();

        return this;
    };

    generateNoiseMap() {
        this.setAll(
            new NoiseMapGenerator(this.config.WORLD_SIZE, 150).generate().getValues()
        );
    };

    considerAltitude() {

        let _this = this;

        // higher altitude = lower humidity
        _this.foreach(function(x, y) {
            _this.addToCell(x, y, -_this.altitudeMap.getCell(x, y));
        });
    };

    considerRivers() {

        let _this = this;

        // rivers increase humidity
        _this.riversMap.foreachFilled(function(x, y) {

            _this.addToCell(x, y, 0.2);

            _this.foreachAroundRadius(x, y, 5, function(nx, ny) {
                if (!_this.riversMap.filled(nx, ny)) {
                    _this.addToCell(nx, ny, 0.02);
                }
            });
        });
    };

    considerLakes() {

        let _this = this;

        // lakes increase humidity
        _this.lakesMap.foreachFilled(function(x, y) {
            _this.foreachAroundRadius(x, y, 5, function(nx, ny) {
                _this.addToCell(nx, ny, 0.015);
            });
        });
    };
}