class OceanMap extends BinaryMatrix {

    MAX_OCEAN_LEVEL = 0.2;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {OceanMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldWidth, config.worldHeight);

        let _this = this;

        _this.MAX_OCEAN_LEVEL = typeof config.MAX_OCEAN_LEVEL === 'undefined'
            ? _this.MAX_OCEAN_LEVEL
            : config.MAX_OCEAN_LEVEL;

        if (!altitudeMap.isWater(altitudeMap.getTile(0, 0))) {
            return _this;
        }

        let activePoints = [],
            point;

        _this.fill(0, 0);
        activePoints.push([0, 0]);

        while(activePoints.length) {

            point = activePoints.pop();

            altitudeMap.foreachNeighbors(point[0], point[1], 1, function(x, y) {

                let altitude = altitudeMap.getTile(x, y);

                if (altitudeMap.isWater(altitude)) {
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