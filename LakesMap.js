class LakesMap extends BinaryMatrix {

    altitudeMap;
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
            if (_this.altitudeMap.isWater(
                _this.altitudeMap.getTile(x, y))
                && !_this.oceanMap.filled(x, y)
            ) {
                _this.fill(x, y);
            }
        });

        return _this;
    };

    /**
     * @param {number} startX
     * @param {number} startY
     * @return {number}
     */
    getLakeSizeFromPoint = function(startX, startY) {

        let _this = this;

        if (!_this.filled(startX, startY)) {
            return 0;
        }

        let map = new BinaryMatrix(config.worldSize, config.worldSize),
            activePoints = [],
            point;

        map.map(0);
        map.fill(startX, startY);
        activePoints.push([startX, startY]);

        while(activePoints.length) {

            point = activePoints.pop();

            _this.altitudeMap.foreachNeighbors(point[0], point[1], 1, function(x, y) {

                let altitude = _this.altitudeMap.getTile(x, y);

                if (_this.altitudeMap.isWater(altitude)) {
                    if (!map.filled(x, y)) {
                        map.fill(x, y);
                        activePoints.push([x, y]);
                    }
                }
            });
        }

        return map.getFilledTiles().length;
    };
}