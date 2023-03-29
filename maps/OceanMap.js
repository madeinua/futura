class OceanMap extends BinaryMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    constructor(altitudeMap) {
        super();

        this.altitudeMap = altitudeMap;
    };

    /**
     * @param {number} startX
     * @param {number} startY
     */
    includeAllWatterCellsAround = function(startX, startY) {

        let _this = this,
            activePoints = [],
            point;

        _this.fill(startX, startY);

        activePoints.push([startX, startY]);

        while(activePoints.length) {

            point = activePoints.pop();

            _this.altitudeMap.foreachAroundRadius(point[0], point[1], 1, function(x, y) {

                let altitude = _this.altitudeMap.getCell(x, y);

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
            tempMap = new BinaryMatrix();

        _this.altitudeMap.foreach(function(x, y) {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getCell(x, y))
                && !_this.filled(x, y)
            ) {
                tempMap.fill(x, y);
            }
        });

        tempMap.foreachFilled(function(x, y) {
            if (
                !_this.filled(x, y)
                && tempMap.getSizeFromPoint(x, y) > config.WORLD_SIZE
            ) {
                _this.includeAllWatterCellsAround(x, y);
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

        if (!_this.altitudeMap.isWater(_this.altitudeMap.getCell(startX, startY))) {
            return _this;
        }

        _this.includeAllWatterCellsAround(startX, startY);
        _this.bigLakesToSeas();

        return _this;
    };
}