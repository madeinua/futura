class OceanMap extends BinaryMatrix {

    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {Object} config
     * @return {OceanMap}
     */
    constructor(altitudeMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;

        return this;
    };

    /**
     * @return {OceanMap}
     */
    generateMap = function() {

        let _this = this,
            startX = 0,
            startY = 0;

        if (!_this.altitudeMap.isWater(_this.altitudeMap.getTile(startX, startY))) {
            return _this;
        }

        let activePoints = [],
            point;

        _this.fill(startX, startY);
        activePoints.push([startX, startY]);

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