class LakesMap extends BinaryMatrix {

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {Object} config
     * @return {LakesMap}
     */
    constructor(altitudeMap, oceanMap, config) {

        super(config.worldWidth, config.worldHeight);

        let _this = this;

        altitudeMap.foreach(function(x, y) {
            if (altitudeMap.isWater(altitudeMap.getTile(x, y)) && !oceanMap.filled(x, y)) {
                _this.fill(x, y);
            }
        });

        return _this;
    };
}