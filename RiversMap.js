class RiversMap extends BinaryMatrix {

    altitudeMap;
    lakesMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {LakesMap} lakesMap
     * @param {Object} config
     * @return {RiversMap}
     */
    constructor(altitudeMap, lakesMap, config) {

        super(config.worldSize, config.worldSize);

        this.config = config;
        this.altitudeMap = altitudeMap;
        this.lakesMap = lakesMap;

        return this;
    };

    /**
     * @return {RiversMap}
     */
    generateMap = function() {

        let _this = this;

        let riverSources = _this.getRiverSources(_this.altitudeMap),
            rivers = [],
            allRiversPoints = [],
            riversLimit = Math.floor(tval(_this.config.RIVERS_DENSITY, 1, riverSources.length));

        for (let i = 0; i < riverSources.length; i++) {

            let river = [],
                finished = false,
                tile;

            // source = starting point of each river
            river.push(riverSources[i]);

            // max river length = worldSize
            for (let j = 0; j < _this.config.worldSize; j++) {

                let nextRiverPoint = _this.getRiverDirection(river, _this.altitudeMap, allRiversPoints);

                if (!nextRiverPoint.length) {
                    break;
                }

                tile = _this.altitudeMap.getTile(nextRiverPoint[0], nextRiverPoint[1]);

                // lake/ocean found. means river ending point found.
                if (_this.altitudeMap.isWater(tile)) {

                    if (_this.lakesMap.filled(nextRiverPoint[0], nextRiverPoint[1])) {

                        let lakeSize = _this.lakesMap.getLakeSizeFromPoint(nextRiverPoint[0], nextRiverPoint[1]);

                        // if river is bigger than lake than this is not the final target
                        if (lakeSize > river.length * config.LAKE_TO_RIVER_RATIO) {
                            finished = true;
                            break;
                        }

                    } else {
                        finished = true;
                        break;
                    }
                }

                river.push(nextRiverPoint);
            }

            if (finished && river.length >= _this.config.RIVER_MIN_LENGTH) {
                rivers.push(river);
                allRiversPoints = allRiversPoints.concat(river);
                allRiversPoints.unique();
            }

            if (rivers.length === riversLimit) {
                break;
            }
        }

        _this.createRiverMapFromRiversPoints(rivers);

        return _this;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {Array} riverPoints
     * @return {boolean}
     */
    isTooCloseToRivers = function(x, y, riverPoints) {
        return this.config.RIVERS_CLOSENESS >= riverPoints.getClosestDistanceTo(x, y);
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {Array}
     */
    getRiverSources = function(altitudeMap) {

        let _this = this,
            spawns = [],
            riverSources = [];

        altitudeMap.foreach(function(x, y) {

            let altitude = altitudeMap.getTile(x, y);

            if (
                altitudeMap.isGround(altitude)
                && altitude >= _this.config.RIVER_SOURCE_MIN_ALTITUDE
                && _this.config.RIVER_SOURCE_MAX_ALTITUDE >= altitude
            ) {
                spawns.push([x, y]);
            }
        });

        spawns = spawns.shuffle();

        for (let i = 0; i < spawns.length; i++) {
            if (!_this.isTooCloseToRivers(spawns[i][0], spawns[i][1], riverSources)) {
                riverSources.push(spawns[i]);
            }
        }

        return riverSources;
    };

    /**
     * @param {Array} river
     * @param {AltitudeMap} altitudeMap
     * @param {Array} otherRiverPoints
     * @return {Array}
     */
    getRiverDirection = function(river, altitudeMap, otherRiverPoints) {

        let _this = this,
            currentPoint = river[river.length - 1],
            prevPoint = river.length > 1 ? river[river.length - 2] : false,
            cx = currentPoint[0],
            cy = currentPoint[1],
            currentAltitude = altitudeMap.getTile(cx, cy),
            neighbors = altitudeMap.getNeighbors(cx, cy, 2).shuffle(),
            lowerPoint = [];

        for (let i = 0; i < neighbors.length; i++) {

            let nx = neighbors[i][0],
                ny = neighbors[i][1],
                altitude = altitudeMap.getTile(nx, ny);

            if (altitude > currentAltitude) {
                continue;
            }

            // prevent river being too close to the other river
            if (_this.isTooCloseToRivers(nx, ny, otherRiverPoints)) {
                continue;
            }

            // prevent river being "too wide"
            if (prevPoint && distance(nx, ny, prevPoint[0], prevPoint[1]) === 1) {
                continue;
            }

            lowerPoint = [nx, ny];
            break;
        }

        return lowerPoint;
    };

    /**
     * Add river delta
     * @param {Array} river
     * @return {RiversMap}
     */
    addRiverDeltaToRiverMap = function(river) {

        let _this = this,
            deltaLength = river.length * randBetweenFloats(0, _this.config.RIVER_DELTA_MAX_LENGTH),
            notDeltaLength = river.length - deltaLength;

        for (let p = 0; p < river.length; p++) {
            if (p > notDeltaLength) {
                _this.foreachNeighbors(river[p][0], river[p][1], 0, function(nx, ny) {
                    if ([0, 1].randomElement() === 0) {
                        _this.fill(nx, ny);
                    }
                });
            }
        }
    };

    /**
     * @param {Array} rivers
     * @return {RiversMap}
     */
    createRiverMapFromRiversPoints = function(rivers) {

        let _this = this;

        for (let i = 0; i < rivers.length; i++) {

            for (let p = 0; p < rivers[i].length; p++) {
                _this.fill(rivers[i][p][0], rivers[i][p][1]);
            }

            _this.addRiverDeltaToRiverMap(rivers[i]);
        }
    };
}