class LakesMap extends BinaryMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {OceanMap} */
    oceanMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {Object} config
     * @return {LakesMap}
     */
    constructor(altitudeMap, oceanMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;

        return this;
    };

    /**
     * @return {LakesMap}
     */
    generateMap = function() {

        let _this = this;

        _this.altitudeMap.foreach(function(x, y) {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getTile(x, y))
                && !_this.oceanMap.filled(x, y)
            ) {
                _this.fill(x, y);
            }
        });

        return _this;
    };
}