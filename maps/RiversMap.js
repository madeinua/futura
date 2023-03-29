class RiversMap extends BinaryMatrix {

    /** @var {number} */
    riversCount;

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {LakesMap} */
    lakesMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {LakesMap} lakesMap
     * @return {RiversMap}
     */
    constructor(altitudeMap, lakesMap) {
        super();

        this.altitudeMap = altitudeMap;
        this.lakesMap = lakesMap;
        this.riversCount = 0;
    };

    /**
     * @return {RiversMap}
     */
    generateMap = function() {

        let riverSources = this.getRiverSources(this.altitudeMap),
            rivers = this.generateRiversCells(riverSources);

        //rivers = _this.addRiverDeltaToRiversMaps(rivers);

        this.createRiverMapFromRiversPoints(rivers);

        this.riversCount = rivers.length;

        return this;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {Array}
     */
    getRiverSources = function(altitudeMap) {

        let spawns = [];

        altitudeMap.foreach(function(x, y) {

            let altitude = altitudeMap.getCell(x, y);

            if (
                altitudeMap.isGround(altitude)
                && altitude >= config.RIVER_SOURCE_MIN_ALTITUDE
                && config.RIVER_SOURCE_MAX_ALTITUDE >= altitude
            ) {
                spawns.push([x, y]);
            }
        });

        return spawns.shuffle();
    };

    /**
     * @returns {Array}
     */
    generateRiversCells = function(riverSources) {

        let _this = this,
            rivers = [],
            allRiversPoints = [],
            riversLimit = Math.floor(fromFraction(config.RIVERS_DENSITY, 1, config.WORLD_SIZE)),
            startCloseness = Math.max(config.RIVER_MIN_LENGTH, config.RIVER_START_CLOSENESS);

        for (let i = 0; i < riverSources.length; i++) {

            // Start point is too close to the other river -> skip
            if (i > 0 && startCloseness >= allRiversPoints.getClosestDistanceTo(riverSources[i][0], riverSources[i][1])) {
                continue;
            }

            let river = [],
                finished = false;

            // source = starting point of each river
            river.push(riverSources[i]);

            // max river length = worldSize
            for (let j = 0; j < config.WORLD_SIZE; j++) {

                let nextRiverPoint = _this.getRiverDirection(river, _this.altitudeMap);

                if (!nextRiverPoint.length) {
                    break;
                }

                let x = nextRiverPoint[0],
                    y = nextRiverPoint[1],
                    altitude = _this.altitudeMap.getCell(x, y);

                // lake/ocean or another river found. means river ending point found.
                if (_this.altitudeMap.isWater(altitude) || arrayHasPoint(allRiversPoints, x, y)) {

                    if (_this.lakesMap.filled(x, y)) {

                        let lakeSize = _this.lakesMap.getSizeFromPoint(x, y);

                        // finish only when the lake size is bigger than the river length
                        if (lakeSize > river.length * config.LAKE_TO_RIVER_RATIO) {
                            finished = true;
                            break;
                        }

                    } else {
                        finished = true;
                        break;
                    }
                }

                if (!finished) {
                    river.push(nextRiverPoint);
                }
            }

            if (finished && river.length >= config.RIVER_MIN_LENGTH) {

                rivers.push(river);
                allRiversPoints = allRiversPoints.concat(river);
                allRiversPoints.unique();

                if (rivers.length === riversLimit) {
                    break;
                }
            }
        }

        return rivers;
    };

    /**
     * @param {Array} river
     * @param {AltitudeMap} altitudeMap
     * @return {Array}
     */
    getRiverDirection = function(river, altitudeMap) {

        let currentPoint = river[river.length - 1],
            prevPoint = river.length > 1 ? river[river.length - 2] : false,
            cx = currentPoint[0],
            cy = currentPoint[1],
            currentAltitude = altitudeMap.getCell(cx, cy),
            neighbors = altitudeMap.getNeighbors(cx, cy).shuffle(),
            lowerPoint = [];

        for (let i = 0; i < neighbors.length; i++) {

            let nx = neighbors[i][0],
                ny = neighbors[i][1],
                altitude = altitudeMap.getCell(nx, ny);

            if (altitude > currentAltitude) {
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
     * @return {Array}
     */
    addRiverDeltaToRiverMap = function(river) {

        let _this = this,
            ratio = randBetweenNumbers(0.01, config.RIVER_DELTA_MAX_LENGTH),
            deltaLength = river.length * ratio,
            notDeltaLength = river.length - deltaLength,
            delta = [];

        for (let p = 0; p < river.length; p++) {
            if (p > notDeltaLength) {
                _this.foreachAroundRadius(river[p][0], river[p][1], 1, function(nx, ny) {
                    if ([0, 1].randomElement() === 0 && !river.includes([nx, ny])) {
                        delta.push([nx, ny]);
                    }
                });
            }
        }

        return river.concat(delta);
    };

    /**
     * @param {Array} rivers
     * @return {Array}
     */
    addRiverDeltaToRiversMaps = function(rivers) {

        for (let i = 0; i < rivers.length; i++) {
            rivers[i] = this.addRiverDeltaToRiverMap(rivers[i]);
        }

        return rivers;
    };

    /**
     * @param {Array} rivers
     * @return {RiversMap}
     */
    createRiverMapFromRiversPoints = function(rivers) {
        for (let i = 0; i < rivers.length; i++) {
            for (let p = 0; p < rivers[i].length; p++) {
                this.fill(rivers[i][p][0], rivers[i][p][1]);
            }
        }
    };

    /**
     * @return {number}
     */
    getGeneratedRiversCount = function() {
        return this.riversCount;
    };
}