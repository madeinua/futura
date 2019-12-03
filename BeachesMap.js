class BeachesMap extends BinaryMatrix {

    MAX_BEACH_LEVEL = 0.32;

    altitudeMap;
    oceanMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {Object} config
     * @return {BeachesMap}
     */
    constructor(altitudeMap, oceanMap, config) {

        super(config.worldWidth, config.worldHeight);

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;

        this.MAX_BEACH_LEVEL = typeof config.MAX_BEACH_LEVEL === 'undefined'
            ? this.MAX_BEACH_LEVEL
            : config.MAX_BEACH_LEVEL;

        return this;
    };

    /**
     * @return {BeachesMap}
     */
    generateMap = function () {

        let _this = this;

        _this.oceanMap.foreachAllFilledNeighbors(1, function(x, y) {
            if (_this.isBeach(_this.altitudeMap.getTile(x, y))) {
                _this.fill(x, y);
            }
        });

        return _this;
    };

    /**
     * @param level
     * @return {boolean}
     */
    isBeach = function(level) {
        return level > this.altitudeMap.MAX_COAST_LEVEL && this.MAX_BEACH_LEVEL > level;
    };
}