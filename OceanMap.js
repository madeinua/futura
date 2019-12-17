class OceanMap extends BinaryMatrix {

    MAX_OCEAN_LEVEL = 0.2;

    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {OceanMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldSize, config.worldSize);

        this.MAX_OCEAN_LEVEL = typeof config.MAX_OCEAN_LEVEL === 'undefined'
            ? this.MAX_OCEAN_LEVEL
            : config.MAX_OCEAN_LEVEL;

        this.altitudeMap = altitudeMap;

        return this;
    };

    /**
     * @return {OceanMap}
     */
    generateMap = function() {

        let _this = this;

        if (!_this.altitudeMap.isWater(_this.altitudeMap.getTile(0, 0))) {
            return _this;
        }

        let activePoints = [],
            point;

        _this.fill(0, 0);
        activePoints.push([0, 0]);

        while(activePoints.length) {

            point = activePoints.pop();

            _this.altitudeMap.foreachNeighbors(point[0], point[1], 1, function(x, y) {

                let altitude = _this.altitudeMap.getTile(x, y);

                if (_this.altitudeMap.isWater(altitude)) {
                    if (!_this.filled(x, y)) {
                        _this.fill(x, y);
                        activePoints.push([x, y]);
                    }
                }
            });
        }

        return _this;
    };
}