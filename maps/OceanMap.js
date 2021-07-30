class OceanMap extends BinaryMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    constructor(altitudeMap) {
        super(config.worldSize, config.worldSize);
        this.altitudeMap = altitudeMap;
        return this;
    };

    /**
     * @param {number} startX
     * @param {number} startY
     */
    includeAllWatterTilesAround = function(startX, startY) {

        let _this = this,
            activePoints = [],
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
    };

    bigLakesToSeas = function() {

        let _this = this,
            tempMap = new BinaryMatrix(config.worldSize, config.worldSize);

        _this.altitudeMap.foreach(function(x, y) {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getTile(x, y))
                && !_this.filled(x, y)
            ) {
                tempMap.fill(x, y);
            }
        });

        tempMap.foreachFilled(function(x, y) {
            if (
                !_this.filled(x, y)
                && tempMap.getSizeFromPoint(x, y) > config.worldSize
            ) {
                _this.includeAllWatterTilesAround(x, y);
            }
        });
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

        _this.includeAllWatterTilesAround(startX, startY);
        _this.bigLakesToSeas();

        return _this;
    };
}