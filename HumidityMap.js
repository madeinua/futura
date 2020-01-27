class HumidityMap extends PointMatrix {

    altitudeMap;
    riversMap;
    lakesMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {Object} config
     * @return {HumidityMap}
     */
    constructor(altitudeMap, riversMap, lakesMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
        this.config = config;

        return this;
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
            createNoiseMap(this.config.worldSize, 150).getAll()
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

            _this.addToTile(x, y, -0.2);

            _this.foreachNeighbors(x, y, 5, function(nx, ny) {
                if (!_this.riversMap.filled(nx, ny)) {
                    _this.addToTile(nx, ny, -0.02);
                }
            });
        });
    };

    considerLakes() {

        let _this = this;

        // lakes increase humidity
        _this.lakesMap.foreachFilled(function(x, y) {
            _this.foreachNeighbors(x, y, 5, function (nx, ny) {
                _this.addToTile(nx, ny, - 0.015);
            });
        });
    };
}