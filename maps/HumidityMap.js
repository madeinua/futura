class HumidityMap extends PointMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {RiversMap} */
    riversMap;

    /** @var {LakesMap} */
    lakesMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    constructor(altitudeMap, riversMap, lakesMap) {
        super();

        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
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
            createNoiseMap(config.WORLD_SIZE, 150).getAll()
        );
    };

    considerAltitude() {

        let _this = this;

        // higher altitude = lower humidity
        _this.foreach(function(x, y) {
            _this.addToTile(x, y, -_this.altitudeMap.getTile(x, y));
        });
    };

    considerRivers() {

        let _this = this;

        // rivers increase humidity
        _this.riversMap.foreachFilled(function(x, y) {

            _this.addToTile(x, y, 0.2);

            _this.foreachAroundRadius(x, y, 5, function(nx, ny) {
                if (!_this.riversMap.filled(nx, ny)) {
                    _this.addToTile(nx, ny, 0.02);
                }
            });
        });
    };

    considerLakes() {

        let _this = this;

        // lakes increase humidity
        _this.lakesMap.foreachFilled(function(x, y) {
            _this.foreachAroundRadius(x, y, 5, function (nx, ny) {
                _this.addToTile(nx, ny, 0.015);
            });
        });
    };
}